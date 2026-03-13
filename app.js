(function () {
  'use strict';

  var contacts = [
    { id: 1, name: 'Анна Коваленко', phone: '+380 67 123 45 67' },
    { id: 2, name: 'Богдан Шевченко', phone: '+380 50 234 56 78' },
    { id: 3, name: 'Вікторія Мельник', phone: '+380 63 345 67 89' },
    { id: 4, name: 'Дмитро Кравченко', phone: '+380 97 456 78 90' },
    { id: 5, name: 'Олена Бондаренко', phone: '+380 66 567 89 01' },
    { id: 6, name: 'Ігор Ткаченко', phone: '+380 93 678 90 12' },
    { id: 7, name: 'Марія Коваль', phone: '+380 67 789 01 23' },
    { id: 8, name: 'Сергій Олійник', phone: '+380 50 890 12 34' },
    { id: 9, name: 'Юлія Петренко', phone: '+380 63 901 23 45' },
    { id: 10, name: 'Андрій Савченко', phone: '+380 97 012 34 56' }
  ];

  var searchInput = document.getElementById('search-input');
  var contactListEl = document.getElementById('contact-list');
  var screenContacts = document.getElementById('screen-contacts');
  var screenProfile = document.getElementById('screen-profile');
  var screenCall = document.getElementById('screen-call');
  var btnBack = document.getElementById('btn-back');
  var btnCall = document.getElementById('btn-call');
  var btnEndCall = document.getElementById('btn-end-call');
  var profileAvatar = document.getElementById('profile-avatar');
  var profileName = document.getElementById('profile-name');
  var profilePhone = document.getElementById('profile-phone');
  var callName = document.getElementById('call-name');
  var callPhone = document.getElementById('call-phone');
  var callStatus = document.getElementById('call-status');

  var selectedContact = null;
  var callTimerInterval = null;

  function getInitials(name) {
    return name.split(' ').map(function (n) { return n[0] || ''; }).join('').slice(0, 2).toUpperCase();
  }

  function filterContacts(query) {
    var q = (query || '').trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(function (c) {
      return c.name.toLowerCase().indexOf(q) !== -1 ||
             c.phone.replace(/\s/g, '').indexOf(q.replace(/\s/g, '')) !== -1;
    });
  }

  function renderContactList(list) {
    contactListEl.innerHTML = '';
    list.forEach(function (contact) {
      var li = document.createElement('li');
      li.className = 'contact-item';
      li.dataset.contactId = String(contact.id);
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');
      li.innerHTML =
        '<span class="contact-avatar" aria-hidden="true">' + getInitials(contact.name) + '</span>' +
        '<div class="contact-info">' +
          '<p class="contact-name">' + escapeHtml(contact.name) + '</p>' +
          '<p class="contact-phone">' + escapeHtml(contact.phone) + '</p>' +
        '</div>';
      contactListEl.appendChild(li);
    });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showScreen(screenEl) {
    screenContacts.classList.remove('screen-active');
    screenProfile.classList.remove('screen-active');
    screenCall.classList.remove('screen-active');
    if (screenEl) screenEl.classList.add('screen-active');
  }

  function openProfile(contact) {
    selectedContact = contact;
    profileAvatar.textContent = getInitials(contact.name);
    profileName.textContent = contact.name;
    profilePhone.textContent = contact.phone;
    showScreen(screenProfile);
  }

  function openCall(contact) {
    selectedContact = contact;
    callName.textContent = contact.name;
    callPhone.textContent = contact.phone;
    callStatus.textContent = 'Дзвінок…';
    showScreen(screenCall);
    startCallTimer();
  }

  function startCallTimer() {
    if (callTimerInterval) clearInterval(callTimerInterval);
    var start = Date.now();
    callTimerInterval = setInterval(function () {
      var sec = Math.floor((Date.now() - start) / 1000);
      var m = Math.floor(sec / 60);
      var s = sec % 60;
      callStatus.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }, 1000);
  }

  function endCall() {
    if (callTimerInterval) {
      clearInterval(callTimerInterval);
      callTimerInterval = null;
    }
    showScreen(screenContacts);
  }

  contactListEl.addEventListener('click', function (e) {
    var item = e.target.closest('.contact-item');
    if (!item) return;
    var id = item.dataset.contactId;
    var contact = contacts.find(function (c) { return String(c.id) === id; });
    if (contact) openProfile(contact);
  });

  contactListEl.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var item = e.target.closest('.contact-item');
    if (!item) return;
    e.preventDefault();
    var id = item.dataset.contactId;
    var contact = contacts.find(function (c) { return String(c.id) === id; });
    if (contact) openProfile(contact);
  });

  searchInput.addEventListener('input', function () {
    renderContactList(filterContacts(searchInput.value));
  });

  btnBack.addEventListener('click', function () {
    showScreen(screenContacts);
  });

  btnCall.addEventListener('click', function () {
    if (selectedContact) openCall(selectedContact);
  });

  btnEndCall.addEventListener('click', function () {
    endCall();
  });

  renderContactList(contacts);
})();
