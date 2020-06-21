import * as React from 'react';
import Text from './TextView';

interface LocationViewProps {
    id: string;
    description: string;
}

function LocationView(props: LocationViewProps) {
    return (
        <div className="location">
            <h1 className="title"
                aria-label={`title: ${props.id}`}
            >--- {props.id} ---</h1>
            <div className="description">
                <Text text={props.description} />
            </div>
        </div>
    );
}

export default LocationView;
