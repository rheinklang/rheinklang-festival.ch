import { observer } from 'mobx-react';
import * as React from 'react';

import { ITimetable } from '../../../schemes/Timetable';
import { TimetableStore } from '../../../store/TimetableStore';
import { Hashtag } from '../../atoms/Hashtag';

import './css/timetable.scss';

interface ITimetableProps {
	timetableStore: TimetableStore
}

@observer
export class Timetable extends React.Component<ITimetableProps> {
	public static displayName = 'Timetable';

	public render() {
		const { timetable } = this.props.timetableStore;

		return (
			<div className="m-timetable">
				{timetable.map(this.renderTimetableEntry)}
			</div>
		)
	}

	private renderTimetableEntry(entry: ITimetable) {
		return (
			<div className={`m-timetable__entry m-timetable__entry--${entry.type}`} key={entry.id}>
				<div className="m-timetable__entry-slot">
					<p>{entry.start_time}<span className="h-hide-on-mobile"> - {entry.end_time}</span></p>
				</div>
				<div className="m-timetable__entry-definition">
					{entry.type === 'guest' && <p className="m-timetable__entry-artist-type">[Gastauftritt]</p>}
					{entry.type === 'headliner' && <p className="m-timetable__entry-artist-type">[Headliner]</p>}
					<h4 className="m-timetable__entry-artist-name">
						{entry.artist.data.name}
					</h4>
					{entry.artist.data.sub_artists && <h5 className="m-timetable__entry-sub-artists">{entry.artist.data.sub_artists}</h5>}
					<div className="m-timetable__tags">
						{entry.artist.data.genre && <Hashtag text={entry.artist.data.genre} />}
						{entry.artist.data.location && <Hashtag text={entry.artist.data.location} />}
					</div>
				</div>
			</div>
		)
	}
}

export default Timetable;
