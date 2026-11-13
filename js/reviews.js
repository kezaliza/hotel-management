(() => {
  const reviewsKey = 'hotelReviews';
  const customerKey = 'hotelCustomer';
  const services = [
    'Room',
    'Spa & Wellness',
    'Restaurant',
    'Airport Pickup',
    'Room Service',
    'Swimming Pool',
    'Staff & Reception',
    'Overall Stay',
  ];
  const errorTargets = document.querySelectorAll('[data-review-error]');

  const createSampleReviews = () => {
    const now = Date.now();
    return [
      {
        id: 'sample-review-1',
        userId: 'sample-guest-amara',
        name: 'Amara N.',
        rating: 5,
        service: 'Overall Stay',
        title: 'A truly memorable stay',
        comment: 'The room was beautifully prepared and every member of staff made us feel welcome. We are already planning our next visit.',
        date: new Date(now - 2 * 86_400_000).toISOString(),
        status: 'Visible',
        isSample: true,
      },
      {
        id: 'sample-review-2',
        userId: 'sample-guest-david',
        name: 'David M.',
        rating: 5,
        service: 'Staff & Reception',
        title: 'Warm and thoughtful service',
        comment: 'Reception was helpful from check-in to checkout, and the team remembered the little details that made our trip special.',
        date: new Date(now - 5 * 86_400_000).toISOString(),
        status: 'Visible',
        isSample: true,
      },
      {
        id: 'sample-review-3',
        userId: 'sample-guest-claire',
        name: 'Claire K.',
        rating: 4,
        service: 'Restaurant',
        title: 'Lovely dinner and atmosphere',
        comment: 'Dinner was delicious and the restaurant felt relaxed and elegant. The staff were attentive without ever rushing us.',
        date: new Date(now - 9 * 86_400_000).toISOString(),
        status: 'Visible',
        isSample: true,
      },
      {
        id: 'sample-review-4',
        userId: 'sample-guest-joel',
        name: 'Joel R.',
        rating: 5,
        service: 'Room Service',
        title: 'Excellent room service',
        comment: 'Our breakfast arrived promptly, was still warm, and was beautifully presented. The whole experience was effortless.',
        date: new Date(now - 14 * 86_400_000).toISOString(),
        status: 'Visible',
        isSample: true,
      },
    ];
  };

  const readReviews = () => {
    const stored = localStorage.getItem(reviewsKey);
    if (stored === null) {
      const samples = createSampleReviews();
      localStorage.setItem(reviewsKey, JSON.stringify(samples));
      return samples;
    }

    const reviews = JSON.parse(stored);
    if (!Array.isArray(reviews)) {
      throw new TypeError('Saved hotel reviews must be a list.');
    }
    return reviews;
  };

  const writeReviews = (reviews) => {
    if (!Array.isArray(reviews)) {
      throw new TypeError('Reviews must be saved as a list.');
    }
    localStorage.setItem(reviewsKey, JSON.stringify(reviews));
  };

  const getCurrentCustomer = () => {
    const stored = localStorage.getItem(customerKey);
    if (!stored) {
      return null;
    }
    const customer = JSON.parse(stored);
    return customer && typeof customer.id === 'string'
      && typeof customer.name === 'string'
      && typeof customer.email === 'string'
      ? customer
      : null;
  };

  const isVisible = (review) => review && review.status !== 'Hidden';

  const appendStars = (container, rating, accessibleLabel = '') => {
    container.classList.add('reviews-stars');
    if (accessibleLabel) {
      container.setAttribute('aria-label', accessibleLabel);
    }
    for (let value = 1; value <= 5; value += 1) {
      const star = document.createElement('i');
      star.className = value <= Number(rating) ? 'fa-solid fa-star' : 'fa-regular fa-star';
      star.setAttribute('aria-hidden', 'true');
      container.append(star);
    }
  };

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return 'Date unavailable';
    }
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const createReviewCard = (review, ownerId = null, includeActions = false) => {
    const card = document.createElement('article');
    card.className = 'card review-card';

    const heading = document.createElement('div');
    heading.className = 'review-card__heading';
    const identity = document.createElement('div');
    identity.className = 'review-card__identity';
    const avatar = document.createElement('span');
    avatar.className = 'review-card__avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = String(review.name || 'Guest')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
    const nameBlock = document.createElement('div');
    const name = document.createElement('h3');
    name.className = 'review-card__name';
    name.textContent = review.name || 'Guest';
    const stars = document.createElement('span');
    appendStars(stars, review.rating, `${review.rating} out of 5 stars`);
    nameBlock.append(name, stars);
    identity.append(avatar, nameBlock);

    const date = document.createElement('time');
    date.className = 'review-card__date';
    date.dateTime = typeof review.date === 'string' ? review.date : '';
    date.textContent = formatDate(review.date);
    heading.append(identity, date);

    const details = document.createElement('div');
    details.className = 'review-card__details';
    const service = document.createElement('span');
    service.className = 'review-card__service';
    service.textContent = review.service || 'Overall Stay';
    if (review.isSample) {
      const sample = document.createElement('span');
      sample.className = 'review-card__sample';
      sample.textContent = 'Sample';
      details.append(service, sample);
    } else {
      details.append(service);
    }

    const title = document.createElement('h3');
    title.className = 'review-card__title';
    title.textContent = review.title || 'Guest review';
    const comment = document.createElement('p');
    comment.className = 'review-card__comment';
    comment.textContent = review.comment || '';
    card.append(heading, details, title, comment);

    if (includeActions && ownerId && review.userId === ownerId) {
      const actions = document.createElement('div');
      actions.className = 'review-card__actions';
      const edit = document.createElement('button');
      edit.className = 'btn btn-outline';
      edit.type = 'button';
      edit.dataset.editReview = review.id;
      edit.textContent = 'Edit';
      const remove = document.createElement('button');
      remove.className = 'btn btn-outline review-card__delete';
      remove.type = 'button';
      remove.dataset.deleteReview = review.id;
      remove.textContent = 'Delete';
      actions.append(edit, remove);
      card.append(actions);
    }
    return card;
  };

  const renderReviewCards = (container, reviews, ownerId = null, includeActions = false) => {
    container.replaceChildren(...reviews.map((review) => createReviewCard(review, ownerId, includeActions)));
  };

  const showStorageError = (message) => {
    errorTargets.forEach((target) => {
      target.textContent = message;
      target.hidden = false;
    });
    const summary = document.querySelector('#reviews-summary-title');
    if (summary) {
      summary.textContent = 'Reviews are unavailable';
    }
    const homeList = document.querySelector('#home-reviews-list');
    if (homeList) {
      homeList.textContent = message;
    }
  };

  const renderSummary = (reviews) => {
    const visible = reviews.filter(isVisible);
    const total = document.querySelector('#reviews-total');
    const average = document.querySelector('#reviews-average');
    const averageStars = document.querySelector('#reviews-average-stars');
    const chart = document.querySelector('#reviews-rating-chart');
    if (!total || !average || !averageStars || !chart) {
      return;
    }
    const ratingTotal = visible.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    const averageRating = visible.length ? ratingTotal / visible.length : 0;
    total.textContent = String(visible.length);
    average.textContent = averageRating.toFixed(1);
    averageStars.replaceChildren();
    appendStars(averageStars, Math.round(averageRating), `${averageRating.toFixed(1)} out of 5 stars`);
    chart.replaceChildren();

    for (let rating = 5; rating >= 1; rating -= 1) {
      const count = visible.filter((review) => Number(review.rating) === rating).length;
      const row = document.createElement('div');
      row.className = 'reviews-summary__row';
      const label = document.createElement('span');
      label.textContent = `${rating} stars`;
      const track = document.createElement('span');
      track.className = 'reviews-summary__track';
      track.setAttribute('aria-hidden', 'true');
      const fill = document.createElement('span');
      fill.className = 'reviews-summary__fill';
      fill.style.width = `${visible.length ? (count / visible.length) * 100 : 0}%`;
      track.append(fill);
      const value = document.createElement('span');
      value.textContent = String(count);
      row.append(label, track, value);
      chart.append(row);
    }
  };

  const renderHomeReviews = (reviews) => {
    const list = document.querySelector('#home-reviews-list');
    if (!list) {
      return;
    }
    const featured = reviews
      .filter(isVisible)
      .sort((left, right) => Number(right.rating) - Number(left.rating)
        || Date.parse(right.date) - Date.parse(left.date))
      .slice(0, 3);
    renderReviewCards(list, featured);
  };

  const form = document.querySelector('#review-form');
  const list = document.querySelector('#reviews-list');
  const empty = document.querySelector('#reviews-empty');
  const noMatch = document.querySelector('#reviews-no-match');
  const login = document.querySelector('#reviews-login');
  const ratingInput = document.querySelector('#review-rating-input');
  const ratingError = document.querySelector('#review-rating-error');
  const ratingFilter = document.querySelector('#review-filter-rating');
  const serviceFilter = document.querySelector('#review-filter-service');
  const sortSelect = document.querySelector('#review-sort');
  const counter = document.querySelector('#review-comment-counter');
  const toast = document.querySelector('#reviews-toast');
  let toastTimer;
  let selectedRating = 0;
  let cachedReviews = [];

  const showToast = (message, isError = false) => {
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.classList.toggle('is-error', isError);
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
  };

  const showFieldError = (fieldName, message) => {
    const error = form.querySelector(`[data-error-for="${fieldName}"]`);
    const field = form.elements.namedItem(fieldName);
    error.textContent = message;
    error.hidden = !message;
    field?.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  const syncRatingButtons = () => {
    [...ratingInput.querySelectorAll('button')].forEach((button) => {
      const rating = Number(button.dataset.rating);
      button.classList.toggle('is-selected', rating <= selectedRating);
      button.setAttribute('aria-pressed', String(rating === selectedRating));
    });
    ratingError.hidden = selectedRating > 0;
    ratingError.textContent = selectedRating ? '' : 'Choose a star rating.';
  };

  const refreshReviewList = () => {
    if (!list) {
      return;
    }
    let visible = cachedReviews.filter(isVisible);
    if (ratingFilter.value !== 'all') {
      visible = visible.filter((review) => Number(review.rating) === Number(ratingFilter.value));
    }
    if (serviceFilter.value !== 'all') {
      visible = visible.filter((review) => review.service === serviceFilter.value);
    }
    if (sortSelect.value === 'highest') {
      visible.sort((left, right) => Number(right.rating) - Number(left.rating)
        || Date.parse(right.date) - Date.parse(left.date));
    } else if (sortSelect.value === 'lowest') {
      visible.sort((left, right) => Number(left.rating) - Number(right.rating)
        || Date.parse(right.date) - Date.parse(left.date));
    } else {
      visible.sort((left, right) => Date.parse(right.date) - Date.parse(left.date));
    }
    const customer = getCurrentCustomer();
    renderReviewCards(list, visible, customer?.id, true);
    empty.hidden = cachedReviews.some(isVisible);
    noMatch.hidden = visible.length > 0 || !empty.hidden;
  };

  const renderReviews = () => {
    try {
      cachedReviews = readReviews();
      renderSummary(cachedReviews);
      renderHomeReviews(cachedReviews);
      refreshReviewList();
      errorTargets.forEach((target) => {
        target.hidden = true;
        target.textContent = '';
      });
    } catch (error) {
      showStorageError('Reviews could not be loaded from browser storage. Check your browser storage settings and try again.');
      if (list) {
        list.replaceChildren();
      }
    }
  };

  const setEditing = (review) => {
    form.elements.namedItem('reviewId').value = review.id;
    form.elements.namedItem('service').value = review.service;
    form.elements.namedItem('title').value = review.title;
    form.elements.namedItem('comment').value = review.comment;
    selectedRating = Number(review.rating);
    syncRatingButtons();
    document.querySelector('#review-submit').textContent = 'Save Changes';
    document.querySelector('#review-cancel-edit').hidden = false;
    document.querySelector('#write-review').scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
    form.reset();
    form.elements.namedItem('reviewId').value = '';
    selectedRating = 0;
    syncRatingButtons();
    counter.textContent = '0 / 500 characters';
    form.querySelectorAll('[data-error-for]').forEach((error) => {
      error.textContent = '';
      error.hidden = true;
    });
    form.querySelectorAll('[aria-invalid]').forEach((field) => field.removeAttribute('aria-invalid'));
    document.querySelector('#review-form-error').hidden = true;
    document.querySelector('#review-submit').textContent = 'Submit Review';
    document.querySelector('#review-cancel-edit').hidden = true;
  };

  if (form && list && empty && noMatch && login && ratingInput && ratingError && ratingFilter && serviceFilter && sortSelect && counter) {
    for (let rating = 1; rating <= 5; rating += 1) {
      const button = document.createElement('button');
      button.className = 'reviews-rating-input__star';
      button.type = 'button';
      button.dataset.rating = String(rating);
      button.setAttribute('aria-label', `${rating} star${rating > 1 ? 's' : ''}`);
      button.setAttribute('aria-pressed', 'false');
      button.innerHTML = '<i class="fa-solid fa-star" aria-hidden="true"></i>';
      ratingInput.append(button);
    }

    const customer = getCurrentCustomer();
    if (customer) {
      login.hidden = true;
      form.hidden = false;
      document.querySelector('#reviewer-name').textContent = customer.name;
    }

    const requestedService = new URLSearchParams(window.location.search).get('service');
    if (requestedService && services.includes(requestedService)) {
      form.elements.namedItem('service').value = requestedService;
    }

    ratingInput.addEventListener('click', (event) => {
      const button = event.target.closest('[data-rating]');
      if (!button) {
        return;
      }
      selectedRating = Number(button.dataset.rating);
      syncRatingButtons();
    });

    form.elements.namedItem('comment').addEventListener('input', (event) => {
      counter.textContent = `${event.target.value.length} / 500 characters`;
      showFieldError('comment', '');
    });
    ['service', 'title'].forEach((fieldName) => {
      form.elements.namedItem(fieldName).addEventListener('input', () => showFieldError(fieldName, ''));
      form.elements.namedItem(fieldName).addEventListener('change', () => showFieldError(fieldName, ''));
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const currentCustomer = getCurrentCustomer();
      if (!currentCustomer) {
        login.hidden = false;
        form.hidden = true;
        return;
      }
      let valid = true;
      const service = form.elements.namedItem('service').value;
      const title = form.elements.namedItem('title').value.trim();
      const comment = form.elements.namedItem('comment').value.trim();
      const reviewFormError = document.querySelector('#review-form-error');
      reviewFormError.hidden = true;
      showFieldError('service', service ? '' : 'Choose a service.');
      showFieldError('title', title ? '' : 'Enter a title.');
      showFieldError('comment', comment.length < 10
        ? 'Comment must be at least 10 characters.'
        : comment.length > 500 ? 'Comment must be 500 characters or fewer.' : '');
      if (!service) {
        valid = false;
      }
      if (!title) {
        valid = false;
      }
      if (comment.length < 10 || comment.length > 500) {
        valid = false;
      }
      if (!selectedRating) {
        syncRatingButtons();
        valid = false;
      }
      if (!valid) {
        return;
      }

      try {
        const reviews = readReviews();
        const reviewId = form.elements.namedItem('reviewId').value;
        const existing = reviewId && reviews.find((review) => review.id === reviewId);
        if (reviewId && (!existing || existing.userId !== currentCustomer.id)) {
          throw new RangeError('This review is no longer available to edit.');
        }
        const review = {
          id: existing?.id || `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          userId: currentCustomer.id,
          name: currentCustomer.name,
          rating: selectedRating,
          service,
          title,
          comment,
          date: new Date().toISOString(),
          status: existing?.status || 'Visible',
          isSample: false,
        };
        const updated = existing
          ? reviews.map((item) => item.id === existing.id ? review : item)
          : [review, ...reviews];
        writeReviews(updated);
        cachedReviews = updated;
        resetForm();
        renderSummary(updated);
        renderHomeReviews(updated);
        refreshReviewList();
        showToast(existing ? 'Your review was updated.' : 'Thank you for your review!');
      } catch (error) {
        reviewFormError.textContent = error instanceof RangeError
          ? error.message
          : 'Your review could not be saved. Check your browser storage settings and try again.';
        reviewFormError.hidden = false;
      }
    });

    document.querySelector('#review-cancel-edit').addEventListener('click', resetForm);
    [ratingFilter, serviceFilter, sortSelect].forEach((control) => control.addEventListener('change', refreshReviewList));
    list.addEventListener('click', (event) => {
      const button = event.target.closest('[data-edit-review], [data-delete-review]');
      if (!button) {
        return;
      }
      const currentCustomer = getCurrentCustomer();
      const review = cachedReviews.find((item) => item.id === (button.dataset.editReview || button.dataset.deleteReview));
      if (!currentCustomer || !review || review.userId !== currentCustomer.id) {
        return;
      }
      if (button.hasAttribute('data-edit-review')) {
        setEditing(review);
        return;
      }
      try {
        const updated = readReviews().filter((item) => item.id !== review.id);
        writeReviews(updated);
        cachedReviews = updated;
        renderSummary(updated);
        renderHomeReviews(updated);
        refreshReviewList();
        showToast('Your review was deleted.');
      } catch (error) {
        showToast('Your review could not be deleted. Check your browser storage settings and try again.', true);
      }
    });
  }

  window.hotelReviews = {
    readReviews,
    writeReviews,
    isVisible,
    getCurrentCustomer,
    createReviewCard,
    renderReviewCards,
    formatDate,
  };

  try {
    const initialReviews = readReviews();
    renderSummary(initialReviews);
    renderHomeReviews(initialReviews);
    if (list) {
      cachedReviews = initialReviews;
      refreshReviewList();
    }
  } catch (error) {
    showStorageError('Reviews could not be loaded from browser storage. Check your browser storage settings and try again.');
  }

  window.addEventListener('storage', (event) => {
    if (event.key === reviewsKey || event.key === customerKey) {
      renderReviews();
      if (form) {
        const currentCustomer = getCurrentCustomer();
        login.hidden = Boolean(currentCustomer);
        form.hidden = !currentCustomer;
        if (currentCustomer) {
          document.querySelector('#reviewer-name').textContent = currentCustomer.name;
        }
      }
    }
  });
})();
