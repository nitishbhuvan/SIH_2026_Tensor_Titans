import React from 'react';
import { Accessibility, Zap } from 'lucide-react';
import './ModeBanner.css';

export default function ModeBanner({ currentMode, onOpenModeModal, t }) {
  const isElderly = currentMode === 'elderly';

  return (
    <div className={`mode-banner ${isElderly ? 'mode-banner--elderly' : 'mode-banner--modern'}`}>
      <div className="mode-banner__status">
        <span className="mode-banner__meta" aria-hidden="true">
          ACCESSIBILITY MODE
        </span>
      </div>

      <div className="mode-banner__body">
        <div className="mode-banner__info">
          <span className="mode-banner__icon" aria-hidden="true">
            {isElderly
              ? <Accessibility size={isElderly ? 28 : 22} />
              : <Zap size={22} />
            }
          </span>
          <div className="mode-banner__text">
            <h2 className="mode-banner__heading">
              {isElderly ? t.bannerElderlyActive : t.bannerModernActive}
            </h2>
            <p className="mode-banner__desc">
              {isElderly ? t.bannerElderlyDesc : t.bannerModernDesc}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mode-banner__btn"
          onClick={onOpenModeModal}
          aria-label={t.bannerChangeBtn}
        >
          {t.bannerChangeBtn}
        </button>
      </div>
    </div>
  );
}
