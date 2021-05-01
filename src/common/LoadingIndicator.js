import React from 'react';

export default function LoadingIndicator(props) {
    return (
        <div className="loader-container">
            <div className="container">
                <div className="graf-bg-container">
                    <div className="graf-layout">
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                    </div>
                </div>
                <div className="loading-indicator" style={{display: 'block', textAlign: 'center', marginTop: '30px'}}>
                    Loading ...
                </div>
            </div>
        </div>
    );
}