let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const butt = document.getElementById('plus-btn');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const description = document.getElementById('description');
const eventType = document.getElementById('eventType');
const eventTypeValue = eventType.options[eventType.selectedIndex].value;
const reminderSelect = document.getElementById('reminderSelect');
const reminderSelectValue = reminderSelect.options[reminderSelect.selectedIndex].value;
const checkbox = document.getElementById('endDate');
const to = document.getElementById('to');
const dateTime = document.getElementById('dateTime');
const reminder = document.getElementById('reminder');

checkbox.addEventListener('click', isChecked);
reminder.addEventListener('click', isChecked);

function isChecked(){
  if(checkbox.checked){
    to.classList.remove('hidden');
    dateTime.classList.remove('hidden');
  }else if(!checkbox.checked){
    to.classList.add('hidden');
    dateTime.classList.add('hidden');
  }

  if(reminder.checked){
    reminderSelect.classList.remove('hidden');
  }else if(!reminder.checked){
    reminderSelect.classList.add('hidden');
  }
}

butt.onclick = function (date) {
  clicked = date;
  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

function openModal(date, e) {
  clicked = date;

  if(e.target.matches('.day')){
    newEventModal.style.display = 'block';
  }else{
    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
      document.getElementById('eventText').innerText = `${eventForDay.title}`;
      document.getElementById('initDate').innerText = `${eventForDay.date}`;
      document.getElementById('eventDescription').innerText = `${eventForDay.description}`;
      document.getElementById('typeOfEvent').innerText = `${eventForDay.eventType}`;
  
      deleteEventModal.style.display = 'block';
    }  
  }
  backDrop.style.display = 'block';
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText =
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.filter(e => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.classList.add('selected-day');
      }

      if (eventForDay) {
        eventForDay.forEach(showEvent =>{
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = showEvent.title;
        daySquare.appendChild(eventDiv);
        })
        
      }

      daySquare.addEventListener('click', (e) => openModal(dayString,e))
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}

window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      newEventModal.style.display = 'none';
      deleteEventModal.style.display = 'none';
      backDrop.style.display = 'none';
      eventTitleInput.value = '';
      clicked = null;
  
      load();
    }
})

function getEvents(){
  const event = document.querySelectorAll('.event')
    Array.from(event).forEach((eventElement) => {
    eventElement.addEventListener('click', (e)=> {
    console.log(e.target);
    });
  });
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
      startDate: startDate.value,
      endDate: endDate.value,
      description: description.value,
      eventType: eventTypeValue,
      reminder: reminderSelectValue
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
    
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();
getEvents();