import React from 'react';

const Indicador = ({ results }) => {
    return (
        <div style={{
            marginLeft: '10px',
            float: 'left',
            paddingTop: '30px'
        }}>
            {results.map((isValid, index) => (
                <div key={index} style={{ color: isValid ? '#009846' : '#FF0000', fontSize: '17.5px' }}>
                    {isValid ? '✔️' : '❌'}
                </div>
            ))}
        </div>
    );
};

export default Indicador;