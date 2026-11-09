const messageList = document.querySelector('#admin-message-list');
const emptyMessages = document.querySelector('#admin-messages-empty');
const messagesError = document.querySelector('#admin-messages-error');
const messagesTotal = document.querySelector('#admin-messages-total');
const messageCount = document.querySelector('#admin-message-count');
const messageToast = document.querySelector('#admin-toast');
let toastTimeout;

const formatMessageDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

const showMessageToast = (message, isError = false) => {
  messageToast.textContent = message;
  messageToast.classList.toggle('is-error', isError);
  messageToast.classList.add('is-visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    messageToast.classList.remove('is-visible');
  }, 3000);
};

const makeDetail = (label, value, className = '') => {
  const wrapper = document.createElement('div');
  wrapper.className = className;
  const term = document.createElement('dt');
  term.textContent = label;
  const detail = document.createElement('dd');
  detail.textContent = value;
  wrapper.append(term, detail);
  return wrapper;
};

const readMessages = () => {
  const value = localStorage.getItem('hotelMessages');
  if (value === null) {
    return [];
  }
  const messages = JSON.parse(value);
  if (!Array.isArray(messages)) {
    throw new TypeError('Saved contact messages must be a list.');
  }
  return messages;
};

const renderMessages = () => {
  messagesError.hidden = true;
  messagesError.textContent = '';
  let messages;
  try {
    messages = readMessages();
  } catch (error) {
    messageList.replaceChildren();
    emptyMessages.hidden = true;
    messagesError.textContent = 'Messages could not be loaded from browser storage.';
    messagesError.hidden = false;
    messagesTotal.textContent = 'Messages unavailable';
    messageCount.textContent = '!';
    return;
  }

  messagesTotal.textContent = `${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`;
  messageCount.textContent = String(messages.length);
  emptyMessages.hidden = messages.length > 0;
  messageList.replaceChildren();

  messages
    .map((message, index) => ({ message, index }))
    .reverse()
    .forEach(({ message, index }) => {
      if (!message || typeof message !== 'object') {
        return;
      }

      const card = document.createElement('article');
      card.className = 'card admin-message';
      const heading = document.createElement('div');
      heading.className = 'admin-message__heading';
      const identity = document.createElement('div');
      const title = document.createElement('h3');
      title.className = 'admin-message__subject';
      title.textContent = typeof message.subject === 'string' && message.subject.trim()
        ? message.subject
        : '(No subject)';
      const sender = document.createElement('p');
      sender.className = 'admin-message__sender';
      sender.textContent = `${message.name || 'Unknown sender'} · ${message.email || 'No email'}`;
      identity.append(title, sender);

      const received = document.createElement('time');
      received.className = 'admin-message__date';
      received.dateTime = typeof message.date === 'string' ? message.date : '';
      received.textContent = formatMessageDate(message.date);
      heading.append(identity, received);

      const content = document.createElement('p');
      content.className = 'admin-message__body';
      content.textContent = typeof message.message === 'string' ? message.message : '';

      const actions = document.createElement('div');
      actions.className = 'admin-message__actions';
      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-outline admin-message__delete';
      deleteButton.type = 'button';
      deleteButton.dataset.messageIndex = String(index);
      deleteButton.setAttribute('aria-label', `Delete message from ${message.name || 'unknown sender'}`);
      deleteButton.innerHTML = '<i class="fa-regular fa-trash-can" aria-hidden="true"></i> Delete';
      actions.append(deleteButton);
      card.append(heading, makeDetail('Email', message.email || 'No email', 'admin-message__email'), content, actions);
      messageList.append(card);
    });
};

if (messageList && emptyMessages && messagesError && messagesTotal && messageCount && messageToast) {
  messageList.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const deleteButton = event.target.closest('[data-message-index]');
    if (!(deleteButton instanceof HTMLButtonElement)) {
      return;
    }

    try {
      const messages = readMessages();
      const index = Number(deleteButton.dataset.messageIndex);
      if (!Number.isInteger(index) || index < 0 || index >= messages.length) {
        throw new RangeError('The selected message no longer exists.');
      }
      messages.splice(index, 1);
      localStorage.setItem('hotelMessages', JSON.stringify(messages));
      renderMessages();
      showMessageToast('Message deleted.');
    } catch (error) {
      showMessageToast('The message could not be deleted. Please try again.', true);
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'hotelMessages') {
      renderMessages();
    }
  });

  renderMessages();
}