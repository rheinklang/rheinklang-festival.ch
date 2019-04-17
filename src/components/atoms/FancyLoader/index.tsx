import * as React from 'react';
import './css/base.scss';

export function Loader({ id }: { id?: string }) {
	return (
		<div className={'a-loader' + (id ? ' a-loader--' + id : '')}>
			<div className="a-loader">
				<div className="a-loader__dot a-loader__dot-1" />
				<div className="a-loader__dot a-loader__dot-2" />
				<div className="a-loader__dot a-loader__dot-3" />
			</div>
			<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
				<defs>
					<filter id="aLoaderFilter">
						<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
						<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" />
					</filter>
				</defs>
			</svg>
		</div >
	);
};
