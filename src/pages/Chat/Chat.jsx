import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, buildInDevelopmentPath } from '../../constants/routes';
import styles from './Chat.module.css';

const NAV_ITEMS = [
  { label: 'Tìm việc', to: ROUTES.JOB_SEARCH },
  { label: 'Tuyển dụng', to: ROUTES.RECRUITMENT_LIST },
  { label: 'Ứng viên', to: ROUTES.CANDIDATES },
  { label: 'Matching', to: ROUTES.MATCHING },
];

const CONVERSATIONS = [
  {
    id: 'employer-a',
    name: 'Nhà tuyển dụng A',
    role: 'Executive Hiring',
    lastMessage: 'Chúng tôi muốn hẹn bạn vào chiều thứ Năm.',
    time: '10:42 AM',
    unread: 2,
    status: 'Đang trao đổi',
    accent: 'primary',
  },
  {
    id: 'employer-b',
    name: 'Nhà tuyển dụng B',
    role: 'Talent Partner',
    lastMessage: 'Lịch phỏng vấn vòng 2 đã được xác nhận.',
    time: 'Yesterday',
    unread: 0,
    status: 'Đã lên lịch',
    accent: 'secondary',
  },
  {
    id: 'tech-corp',
    name: 'Tech Corp',
    role: 'People Operations',
    lastMessage: 'Cảm ơn bạn đã dành thời gian trao đổi.',
    time: 'Mon',
    unread: 0,
    status: 'Lưu trữ',
    accent: 'tertiary',
  },
];

const INITIAL_THREADS = {
  'employer-a': [
    {
      id: 1,
      side: 'left',
      author: 'Nhà tuyển dụng A',
      text:
        'Chào bạn, chúng tôi đã xem hồ sơ và rất ấn tượng với kinh nghiệm quản lý dự án của bạn tại công ty trước đó.',
      time: '10:40 AM',
    },
    {
      id: 2,
      side: 'left',
      author: 'Nhà tuyển dụng A',
      text: 'Bạn có rảnh vào chiều thứ Năm tuần này để trao đổi ngắn khoảng 15 phút không?',
      time: '10:42 AM',
    },
    {
      id: 3,
      side: 'right',
      author: 'Bạn',
      text: 'Chiều thứ Năm tuần này tôi có thể sắp xếp thời gian từ 2:00 PM đến 4:00 PM.',
      time: '10:45 AM',
      read: true,
    },
  ],
  'employer-b': [
    {
      id: 1,
      side: 'left',
      author: 'Nhà tuyển dụng B',
      text: 'Cảm ơn bạn đã tham gia vòng sàng lọc. Chúng tôi sẽ gửi lịch phỏng vấn chi tiết trong hôm nay.',
      time: '09:10 AM',
    },
    {
      id: 2,
      side: 'right',
      author: 'Bạn',
      text: 'Tôi đã nhận được thông tin. Xin cảm ơn và tôi sẽ sắp xếp lịch phù hợp.',
      time: '09:24 AM',
      read: true,
    },
  ],
  'tech-corp': [
    {
      id: 1,
      side: 'left',
      author: 'Tech Corp',
      text: 'Cảm ơn bạn đã dành thời gian. Chúng tôi sẽ giữ liên lạc cho các vị trí phù hợp tiếp theo.',
      time: 'Mon',
    },
  ],
};

function formatDraftTime() {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function Chat() {
  const navigate = useNavigate();
  const [activeConversationId, setActiveConversationId] = useState(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState('');
  const [threads, setThreads] = useState(INITIAL_THREADS);

  const activeConversation = useMemo(
    () => CONVERSATIONS.find((conversation) => conversation.id === activeConversationId) ?? CONVERSATIONS[0],
    [activeConversationId]
  );

  const activeMessages = threads[activeConversationId] ?? [];

  const handleSendMessage = () => {
    const content = draft.trim();

    if (!content) {
      return;
    }

    setThreads((currentThreads) => {
      const currentMessages = currentThreads[activeConversationId] ?? [];

      return {
        ...currentThreads,
        [activeConversationId]: [
          ...currentMessages,
          {
            id: Date.now(),
            side: 'right',
            author: 'Bạn',
            text: content,
            time: formatDraftTime(),
            read: false,
          },
        ],
      };
    });

    setDraft('');
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles['chat-page']}>
      <div className={styles['ambient']} aria-hidden="true" />
      <div className={styles['ambient-alt']} aria-hidden="true" />



      <main className={styles['chat-layout']}>
        <aside className={styles['conversation-rail']}>
          <div className={styles['rail-header']}>
            <h1>Hộp thư tuyển dụng</h1>

            <label className={styles['search-box']}>
              <span aria-hidden="true">⌕</span>
              <input type="search" placeholder="Tìm kiếm cuộc hội thoại..." />
            </label>
          </div>

          <div className={styles['conversation-list']}>
            {CONVERSATIONS.map((conversation) => {
              const isActive = conversation.id === activeConversationId;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  className={`${styles['conversation-card']} ${isActive ? styles['is-active'] : ''}`}
                  onClick={() => setActiveConversationId(conversation.id)}
                >
                  <span className={`${styles['avatar']} ${styles[`accent-${conversation.accent}`]}`} aria-hidden="true">
                    {conversation.name.charAt(0)}
                  </span>

                  <span className={styles['conversation-copy']}>
                    <span className={styles['conversation-row']}>
                      <strong>{conversation.name}</strong>
                      <small>{conversation.time}</small>
                    </span>
                    <span className={styles['conversation-row']}>
                      <span>{conversation.lastMessage}</span>
                      {conversation.unread ? <span className={styles['unread-badge']}>{conversation.unread}</span> : null}
                    </span>
                    <span className={styles['status-chip']}>{conversation.status}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className={styles['thread-panel']}>
          <div className={styles['thread-header']}>
            <div className={styles['thread-title']}>
              <span className={`${styles['avatar']} ${styles['avatar-large']} ${styles['accent-primary']}`} aria-hidden="true">
                {activeConversation.name.charAt(0)}
              </span>
              <div>
                <h2>{activeConversation.name}</h2>
                <p>{activeConversation.role}</p>
              </div>
            </div>
          </div>

          <div className={styles['message-stream']}>
            <div className={styles['date-divider']}>
              <span>TODAY</span>
            </div>

            {activeMessages.map((message) => (
              <article
                key={message.id}
                className={`${styles['message-row']} ${message.side === 'right' ? styles['align-right'] : ''}`}
              >
                {message.side === 'left' ? <span className={`${styles['avatar']} ${styles['message-avatar']} ${styles['accent-secondary']}`} aria-hidden="true">A</span> : null}

                <div className={`${styles['message-bubble']} ${message.side === 'right' ? styles['is-outgoing'] : ''}`}>
                  <p>{message.text}</p>
                  <div className={styles['message-meta']}>
                    <span>{message.time}</span>
                    {message.side === 'right' ? <span>{message.read ? 'Đã xem' : 'Đã gửi'}</span> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles['composer-shell']}>
            <div className={styles['composer']}>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder="Aa"
                rows="2"
              />
              <button type="button" className={styles['send-button']} onClick={handleSendMessage}>
                Gửi
              </button>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Chat;