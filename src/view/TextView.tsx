import * as React from 'react';

interface TextViewProps {
    text: string;
}

function TextView(props: TextViewProps) {
    if (props.text.startsWith('http')) {
        return <a href={props.text}>{props.text}</a>;
    }

    const lines = props.text
        .split('\n')
        .map((line, index) => <p key={index}>{line}</p>);
    return <>{lines}</>;
}

export default TextView;
