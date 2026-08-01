import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({
  children,
  title,
  actions,
  padding = 'medium',
  hoverable = false,
  onClick,
  border = true
}) => {
  const cardClasses = [
    'card',
    `card-padding-${padding}`,
    hoverable && 'card-hoverable',
    onClick && 'card-clickable',
    !border && 'card-no-border'
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={cardClasses} onClick={handleClick}>
      {(title || actions) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  actions: PropTypes.node,
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  hoverable: PropTypes.bool,
  onClick: PropTypes.func,
  border: PropTypes.bool
};

export default Card;
