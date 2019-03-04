const { createFilePath } = require('gatsby-source-filesystem');
const { existsSync } = require('fs');

exports.onCreateWebpackConfig = ({ stage, actions }) => {
	actions.setWebpackConfig({
		resolve: {
			alias: {
				'../../theme.config$': `${__dirname}/src/theme.config`
			}
		}
	});
};

exports.onCreateNode = ({ node, actions, getNode }) => {
	const { createNodeField } = actions;

	if (node.internal.type === 'MarkdownRemark') {
		const path = createFilePath({ node, getNode });
		createNodeField({ name: 'slug', node, value: path.substring(1, path.length - 1) });
	}
};

exports.createPages = ({ graphql, actions }) => {
	const { createPage } = actions;

	return new Promise((resolve, reject) => {
		resolve(
			graphql(`
				{
					allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
						edges {
							node {
								fields {
									slug
								}
							}
						}
					}
				}`
			).then(({ data }) => {
				const posts = data.allMarkdownRemark.edges;
				const postsPerPage = 5;
				const totalPages = Math.ceil(posts.length / postsPerPage);

				for (let i = 0; i < totalPages; i++) {
					createPage({
						path: (i === 0 ? '/' : `/blog/${i + 1}`),
						component: `${__dirname}/src/templates/blog.js`,
						context: {
							limit: postsPerPage,
							skip: i * postsPerPage,
							pageNumber: i + 1,
							totalPages,
						}
					});
				}

				posts.forEach((post, i) => {
					const slug = post.node.fields.slug;
					const previous = i === posts.length - 1 ? null : posts[i + 1].node;
					const next = i === 0 ? null : posts[i - 1].node;

					createPage({
						path: `/post/${slug}`,
						component: `${__dirname}/src/templates/post.js`,
						context: {
							slug,
							previous,
							next,
							hasExample: existsSync(`${__dirname}/examples/${slug}/`),
						},
					});
				});
			})
		);
	});
};
