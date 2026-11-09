const messageList = document.querySelector('#admin-message-list');
const emptyMessages = document.querySelector('#admin-messages-empty');
const messagesError = document.querySelector('#admin-messages-error');
const messagesTotal = document.querySelector('#admin-messages-total');
const messageCount = document.querySelector('#admin-message-count');
const messageToast = document.querySelector('#admin-toast');
const adminImageFallback = 'public/room-placeholder.svg';
let toastTimeout;

document.addEventListener('error', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied === 'placeholder') {
    return;
  }
  const fallback = image.dataset.fallbackSrc;
  if (fallback && image.dataset.fallbackApplied !== 'remote' && image.src !== fallback) {
    image.dataset.fallbackApplied = 'remote';
    image.src = fallback;
    return;
  }
  image.dataset.fallbackApplied = 'placeholder';
  image.src = adminImageFallback;
}, true);

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

const roomList = document.querySelector('#admin-rooms-list');
    const roomCount = document.querySelector('#admin-room-count');
    const roomError = document.querySelector('#admin-rooms-error');
    const roomDialog = document.querySelector('#admin-room-dialog');
    const roomForm = document.querySelector('#admin-room-form');
    const roomPreviews = document.querySelector('#admin-room-previews');
    const roomFormError = document.querySelector('#admin-room-form-error');

    const safeRoomImageUrl = (value) => {
      try {
        const url = new URL(value, window.location.href);
        const isRelativePath = !/^[a-z][a-z\d+.-]*:/i.test(value) && !value.startsWith('//');
        return url.protocol === 'https:'
          || (isRelativePath && url.origin === window.location.origin)
          ? url.href
          : adminImageFallback;
      } catch (error) {
        return adminImageFallback;
      }
    };

    const showRoomError = (element, message) => {
      element.textContent = message;
      element.hidden = !message;
    };

    const loadAdminRooms = () => {
      if (typeof window.loadHotelRooms !== 'function') {
        throw new TypeError('Room storage is not available.');
      }
      return window.loadHotelRooms();
    };

    const renderAdminRooms = () => {
      if (!roomList || !roomCount || !roomError) {
        return;
      }
      try {
        const rooms = loadAdminRooms();
        roomCount.textContent = String(rooms.length);
        roomList.replaceChildren(...rooms.map((room) => {
          const row = document.createElement('tr');
          const coverCell = document.createElement('td');
          const cover = document.createElement('img');
          cover.className = 'admin-rooms__cover';
          cover.src = safeRoomImageUrl(room.images[0]);
          cover.dataset.fallbackSrc = safeRoomImageUrl(room.image);
          cover.alt = `${room.name} cover photo`;
          cover.loading = 'lazy';
          coverCell.append(cover);
          const values = [room.name, room.type, `$${room.price}`, room.status, String(room.images.length)];
          const cells = values.map((value) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            return cell;
          });
          const actions = document.createElement('td');
          const edit = document.createElement('button');
          edit.className = 'btn btn-outline admin-rooms__edit';
          edit.type = 'button';
          edit.textContent = 'Edit';
          edit.dataset.editRoom = room.id;
          actions.append(edit);
          row.append(coverCell, ...cells, actions);
          return row;
        }));
        showRoomError(roomError, '');
      } catch (error) {
        roomList.replaceChildren();
        roomCount.textContent = '!';
        showRoomError(roomError, 'Rooms could not be loaded from browser storage.');
      }
    };

    const previewRoomImages = () => {
      const paths = roomForm.elements.namedItem('images').value
        .split(/\r?\n/)
        .map((path) => path.trim())
        .filter(Boolean);
      roomPreviews.replaceChildren(...paths.map((path, index) => {
        const image = document.createElement('img');
        image.src = safeRoomImageUrl(path);
        image.dataset.fallbackSrc = '';
        image.alt = `Room photo preview ${index + 1}`;
        image.loading = 'lazy';
        image.title = path;
        return image;
      }));
    };

    const openRoomEditor = (room = null) => {
      roomForm.reset();
      roomFormError.hidden = true;
      roomFormError.textContent = '';
      roomForm.elements.namedItem('id').value = room?.id ?? '';
      roomForm.elements.namedItem('name').value = room?.name ?? '';
      roomForm.elements.namedItem('type').value = room?.type ?? 'Single Room';
      roomForm.elements.namedItem('price').value = room?.price ?? '';
      roomForm.elements.namedItem('status').value = room?.status ?? 'Available';
      roomForm.elements.namedItem('beds').value = room?.beds ?? 1;
      roomForm.elements.namedItem('baths').value = room?.baths ?? 1;
      roomForm.elements.namedItem('size').value = room?.size ?? '';
      roomForm.elements.namedItem('maxGuests').value = room?.maxGuests ?? 1;
      roomForm.elements.namedItem('images').value = (room?.images ?? []).join('\n');
      roomForm.elements.namedItem('description').value = room?.description ?? '';
      roomDialog.querySelector('#admin-room-dialog-title').textContent = room ? 'Edit Room' : 'Add Room';
      previewRoomImages();
      roomDialog.showModal();
      roomForm.elements.namedItem('name').focus();
    };

    if (roomList && roomCount && roomError && roomDialog && roomForm && roomPreviews && roomFormError) {
      renderAdminRooms();

      document.querySelector('#admin-add-room').addEventListener('click', () => openRoomEditor());
      roomDialog.querySelector('.admin-room-dialog__close').addEventListener('click', () => roomDialog.close());
      document.querySelector('#admin-room-cancel').addEventListener('click', () => roomDialog.close());
      roomForm.elements.namedItem('images').addEventListener('input', previewRoomImages);

      roomDialog.addEventListener('click', (event) => {
        if (event.target === roomDialog) {
          roomDialog.close();
        }
      });
      roomDialog.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          roomDialog.close();
        }
      });

      roomList.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) {
          return;
        }
        const editButton = event.target.closest('[data-edit-room]');
        if (!editButton) {
          return;
        }
        try {
          const room = loadAdminRooms().find((item) => item.id === editButton.dataset.editRoom);
          if (!room) {
            throw new RangeError('The selected room no longer exists.');
          }
          openRoomEditor(room);
        } catch (error) {
          showRoomError(roomError, 'The selected room could not be loaded for editing.');
        }
      });

      roomForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!roomForm.reportValidity()) {
          return;
        }
        const fields = roomForm.elements;
        const images = fields.namedItem('images').value.split(/\r?\n/).map((path) => path.trim()).filter(Boolean);
        if (!images.length) {
          showRoomError(roomFormError, 'Enter at least one image path or URL.');
          return;
        }
        try {
          const rooms = loadAdminRooms();
          const editingId = fields.namedItem('id').value;
          const suffix = rooms.reduce((maximum, room) => {
            const match = room.id.match(/^R(\d+)$/);
            return match ? Math.max(maximum, Number(match[1])) : maximum;
          }, 100);
          const room = {
            id: editingId || `R${suffix + 1}`,
            name: fields.namedItem('name').value.trim(),
            type: fields.namedItem('type').value,
            price: Number(fields.namedItem('price').value),
            status: fields.namedItem('status').value,
            beds: Number(fields.namedItem('beds').value),
            baths: Number(fields.namedItem('baths').value),
            size: Number(fields.namedItem('size').value),
            maxGuests: Number(fields.namedItem('maxGuests').value),
            images,
            image: images[0],
            description: fields.namedItem('description').value.trim(),
          };
          const updatedRooms = editingId
            ? rooms.map((existing) => existing.id === editingId ? room : existing)
            : [...rooms, room];
          if (typeof window.saveHotelRooms !== 'function') {
            throw new TypeError('Room storage is not available.');
          }
          window.saveHotelRooms(updatedRooms);
          renderAdminRooms();
          roomDialog.close();
          if (messageToast) {
            showMessageToast(editingId ? 'Room updated.' : 'Room added.');
          }
        } catch (error) {
          showRoomError(roomFormError, error instanceof Error ? error.message : 'The room could not be saved.');
        }
      });

      window.addEventListener('storage', (event) => {
        if (event.key === 'hotelRooms' || event.key === 'hotelDataVersion') {
          renderAdminRooms();
        }
      });
    }