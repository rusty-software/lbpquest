import * as React from 'react';

interface InventoryViewProps {
    items: string[];
}

function inventoryString(items: string[]): string {
    if (items.length === 0) {
        return 'Your inventory is empty.';
    }
    return 'Your inventory contains: ' + items.join(', ');
}

function InventoryView(props: InventoryViewProps) {
    return <div className="inventory">{inventoryString(props.items)}</div>;
}

export default InventoryView;
