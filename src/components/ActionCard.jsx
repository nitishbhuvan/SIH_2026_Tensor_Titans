import React from 'react';
import './ActionCard.css';

export default function ActionCard({
  icon: Icon,
  title,
  description,
  buttonLabel,
  variant = 'default',
  onClick,
  serviceId,
  isElderly = false
}) {
  return (
    <div className={`action-card action-card--${variant}`}>
      {/* Service ID metadata */}
      {serviceId && (
        <div className="action-card__meta">
          <span className="action-card__service-id">{serviceId}</span>
        </div>
      )}

      <div className="action-card__body">
        <div className="action-card__icon-wrap" aria-hidden="true">
          {Icon && <Icon size={isElderly ? 28 : 22} />}
        </div>

        <h3 className="action-card__title">{title}</h3>

        <p className="action-card__desc">{description}</p>

        <button
          type="button"
          className={`action-card__btn ${variant === 'emergency' ? 'action-card__btn--emergency' : ''}`}
          onClick={onClick}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
