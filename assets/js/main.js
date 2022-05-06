let nav = 0;
let clicked = null;
let eventSelected = null
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const butt = document.getElementById('plus-btn');
const startDate = document.getElementById('startDate');


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

function openModal(date,e) {
  clicked = date;
  if(e.target.matches('.day')){
    newEventModal.style.display = 'block';
    backDrop.style.display = 'block';
  }
}
function openModal2(calendarEvent,e) {
  eventSelected = calendarEvent;
  document.getElementById('eventText').innerText = `${calendarEvent.title} ${calendarEvent.date}`;
  deleteEventModal.style.display = 'block';
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
        daySquare.id = 'currentDay';
      }
      if (eventForDay) {
        eventForDay.forEach(showEvent =>{
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = showEvent.title;
        daySquare.appendChild(eventDiv);
        eventDiv.addEventListener('click', (e) => openModal2(showEvent,e))
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
backDrop.onclick = function (event) {
   
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
};

function getEvents(){
  const event = document.querySelectorAll('.event')
    Array.from(event).forEach( (eventElement)=>{
      eventElement.addEventListener('click', (e)=>{
    console.log(e.target)
  })
  })
}
function generateId(){
  let identifier = localStorage.getItem("identifier")
  if (identifier == null){
    identifier = 0
  }else{
    identifier = parseInt(identifier)
  }
  identifier = identifier + 1
  localStorage.setItem("identifier", identifier)
  return identifier

}
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [month, day, year].join('/');
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');
    let date = clicked
    if (startDate.value != ""){
      date = formatDate(startDate.value)
    }
    events.push({
      id: generateId(),
      date: date,
      title: eventTitleInput.value,
      startDate: startDate.value //added start date
    });
    
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
    
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter(e => e.id !== eventSelected.id);
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