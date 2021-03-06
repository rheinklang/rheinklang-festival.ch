import * as React from 'react';
import './css/base.scss';
import './css/variations.scss';

export interface ISectionProps {
	children: any;
	id?: string;
	title?: string;
	noSpace?: boolean;
	description?: string;
	skew?: string;
	leaveContentSkewed?: boolean,
	colorize?: 'black' | 'red' | 'green' | 'dark-turquise' | 'white';
}

export const Section = ({ id, leaveContentSkewed, colorize, title, description, children, skew, noSpace }: ISectionProps) => {
	const classes = ['m-section'];

	if (colorize) {
		classes.push(`h-colorize--${colorize}`);
	}
	if (id) {
		classes.push(`m-section--${id}`);
	}
	if (skew) {
		classes.push(`m-section--skew-${skew}`);
	}
	if (noSpace) {
		classes.push('m-section--no-space');
	}
	return (
		<section className={classes.join(' ')}>
			<div className="m-section__slope">
				<article className={"m-section__article" + (leaveContentSkewed ? 'm-section-article--skewed' : '')}>
					{title && <h2 className="m-section__title">{title}</h2>}
					{description && <p className="m-section__description">{description}</p>}
					{children}
				</article>
			</div>
		</section>
	);
};

export default Section;
