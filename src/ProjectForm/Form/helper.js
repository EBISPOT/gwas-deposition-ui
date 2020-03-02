/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react';

export const DisplayFormikState = props =>
    <div style={{ margin: '1rem 0' }}>
        <h3 style={{ fontFamily: 'monospace' }} />
        <pre
            style={{
                background: '#f6f8fa',
                fontSize: '.65rem',
                padding: '.5rem',
            }}
        >
            <strong>props</strong> ={' '}
            {JSON.stringify(props, null, 2)}
        </pre>

        <pre>
            <strong>Test</strong> ={' '}
            {JSON.stringify(props.values.email, null, 2)}
        </pre>
    </div>;
