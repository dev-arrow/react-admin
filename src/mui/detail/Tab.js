import React from 'react';
import FormField from '../form/FormField';

const Tab = ({ label, icon, children, ...rest }) => <span>
    {React.Children.map(children, input => input && (
        <div key={input.props.source} style={input.props.style}>
            <FormField input={input} {...rest} />
        </div>
    ))}
</span>;

export default Tab;
