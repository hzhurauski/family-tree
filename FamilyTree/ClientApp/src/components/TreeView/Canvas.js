import React from 'react';
import PropTypes from 'prop-types';

const Canvas = ({draw, height, width, id}) => {

    const canvas = React.useRef(id);

    React.useEffect(() => {
        const context = canvas.current.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height)
        draw(context, width, height);
    });

    return (
        <canvas ref={canvas} height={height} width={width} id={id}/>
    );
};

Canvas.propTypes = {
  draw: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default Canvas;
