import * as React from 'react';
import Text from './TextView';

interface CommandProps {
    orignalCommand: string;
}

function Command(props: CommandProps) {
    return (
        <div className="command"
             role="textbox"
             aria-label={`${props.orignalCommand}`}>
            <Text text={`> ${props.orignalCommand}`} />
        </div>
    );
}

export default Command;
