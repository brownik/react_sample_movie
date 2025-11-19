import { useState } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';
import './ApiKeyManager.css';

export function ApiKeyManager() {
  const { apiKey, setApiKey } = useApiKey();
  const [isOpen, setIsOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (tempKey.trim()) {
      setApiKey(tempKey.trim());
      setIsOpen(false);
      alert('API 키가 저장되었습니다.');
    } else {
      alert('API 키를 입력해주세요.');
    }
  };

  const handleCancel = () => {
    setTempKey(apiKey);
    setIsOpen(false);
  };

  return (
    <div className="api-key-manager">
      <button
        className="api-key-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="API 키 관리"
      >
        ⚙️ API 키 관리
      </button>

      {isOpen && (
        <div className="api-key-panel">
          <div className="api-key-header">
            <h3>API 키 설정</h3>
            <button
              className="api-key-close"
              onClick={handleCancel}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
          <div className="api-key-content">
            <label htmlFor="api-key-input">OMDb API 키</label>
            <div className="api-key-input-wrapper">
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="API 키를 입력하세요"
                className="api-key-input"
              />
              <button
                type="button"
                className="api-key-toggle-visibility"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? '숨기기' : '보이기'}
              >
                {showKey ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p className="api-key-hint">
              OMDb API 키는{' '}
              <a
                href="https://www.omdbapi.com/apikey.aspx"
                target="_blank"
                rel="noopener noreferrer"
              >
                여기
              </a>
              에서 발급받을 수 있습니다.
            </p>
            <div className="api-key-actions">
              <button className="api-key-button cancel" onClick={handleCancel}>
                취소
              </button>
              <button className="api-key-button save" onClick={handleSave}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

