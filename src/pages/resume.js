import React from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';

import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Basics from '../components/resume/Basics';
import Work from '../components/resume/Work';
import Education from '../components/resume/Education';
import Award from '../components/resume/Award';
import Skill from '../components/resume/Skill';
import Language from '../components/resume/Language';
import resume from '../resume';

export default () => (
	<Layout>
		<SEO title='Resume' />
		<Segment raised>
			<Basics {...resume.basics} />
			<Divider />

			<Header as='h2'>Work</Header>
			<Work.Group>
				{resume.work.map((w, i) => (
					<Work key={i} {...w} />
				))}
			</Work.Group>
			<Divider />

			<Header as='h2'>Education</Header>
			<Education.Group>
				{resume.education.map((e, i) => (
					<Education key={i} {...e} />
				))}
			</Education.Group>
			<Divider />

			<Header as='h2'>Awards</Header>
			<Award.Group>
				{resume.awards.map((a, i) => (
					<Award key={i} {...a} />
				))}
			</Award.Group>
			<Divider />

			<Header as='h2'>Skills</Header>
			<p>These are some of the areas and technologies I'm versed in.</p>
			<Skill.Group>
				{resume.skills.map((s, i) => (
					<Skill key={i} {...s} />
				))}
			</Skill.Group>
			<Divider />

			<Header as='h2'>Languages</Header>
			<Language.Group>
				{resume.languages.map((l, i) => (
					<Language key={i} {...l} />
				))}
			</Language.Group>
			<Divider />
			<p>
				<em>This resume is also available in <a href="/resume.pdf">PDF format</a>.</em>
			</p>
		</Segment>
	</Layout>
);
