import * as React from 'react';
import TextView from './TextView';

interface ItemViewProps {
    text: string;
}

function ItemView(props: ItemViewProps) {
    return (
        <div className="item">
            <TextView text={props.text} />
        </div>
    );
}

export default ItemView;
