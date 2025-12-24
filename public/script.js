document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule');
  const searchInput = document.getElementById('categorySearch');
  
  let allTalks = [];

  // Configuration
  const START_HOUR = 10;
  const START_MINUTE = 0;
  const TRANSITION_DURATION = 10; // minutes
  const LUNCH_DURATION = 60; // minutes
  const LUNCH_AFTER_TALK_INDEX = 2; // 0-based index (after 3rd talk)

  // Fetch data
  fetch('talks.json')
    .then(response => response.json())
    .then(data => {
      allTalks = data;
      renderSchedule(allTalks);
    })
    .catch(err => console.error('Error fetching talks:', err));

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filteredTalks = allTalks.filter(talk => 
      talk.categories.some(cat => cat.toLowerCase().includes(term))
    );
    renderSchedule(filteredTalks, true);
  });

  function renderSchedule(talks, isFiltered = false) {
    scheduleContainer.innerHTML = '';
    
    if (talks.length === 0) {
      scheduleContainer.innerHTML = '<p class="text-center">No talks found matching that category.</p>';
      return;
    }

    // Initialize time (in minutes from midnight)
    let currentTime = START_HOUR * 60 + START_MINUTE;

    // If filtered, we still render them in their original slots conceptually, 
    // OR we just show the cards. 
    // Usually in a schedule view, filtering just hides non-matching items but keeps the time structure?
    // Or does it show a list of results?
    // The prompt says "users can search the talks". 
    // I will re-calculate the *display* logic. 
    // Actually, strictly speaking, if I filter, the "times" shouldn't change for the talks. 
    // The talks have fixed slots. I should calculate the slots FIRST for ALL talks, then filter visibility.
    
    // So, let's pre-calculate slots for the original full list.
    const processedTalks = calculateSchedule(allTalks);
    
    // Now filter the processed list
    const displayTalks = isFiltered 
      ? processedTalks.filter(item => 
          item.type === 'talk' && 
          item.data.categories.some(cat => cat.toLowerCase().includes(searchInput.value.toLowerCase()))
        )
      : processedTalks;

    displayTalks.forEach(item => {
      if (item.type === 'talk') {
        const talkCard = createTalkCard(item);
        scheduleContainer.appendChild(talkCard);
      } else if (item.type === 'lunch' && !isFiltered) {
        // Only show lunch break if not filtering (or maybe always show? usually hide on strict filter)
        // Let's hide lunch if filtering specific talks to avoid clutter.
        const breakCard = createBreakCard(item);
        scheduleContainer.appendChild(breakCard);
      }
    });
  }

  function calculateSchedule(talks) {
    let currentMin = START_HOUR * 60 + START_MINUTE;
    const schedule = [];

    talks.forEach((talk, index) => {
      // Calculate Start/End for this talk
      const start = currentMin;
      const end = currentMin + talk.duration;
      
      schedule.push({
        type: 'talk',
        timeRange: formatTimeRange(start, end),
        startMin: start,
        endMin: end,
        data: talk
      });

      // Update current time to End
      currentMin = end;

      // Add Lunch or Transition
      if (index === LUNCH_AFTER_TALK_INDEX) {
        // Lunch Break
        const lunchStart = currentMin;
        const lunchEnd = currentMin + LUNCH_DURATION;
        schedule.push({
          type: 'lunch',
          timeRange: formatTimeRange(lunchStart, lunchEnd),
          label: 'Lunch Break 🍔'
        });
        currentMin = lunchEnd;
      } else if (index < talks.length - 1) {
        // Regular transition between talks (don't add an item, just advance time)
        // Or do we want to show "Transition"? Prompt didn't ask to visualize transition, just "Keep a 10 min transition".
        // I will just advance the time.
        currentMin += TRANSITION_DURATION;
      }
    });

    return schedule;
  }

  function createTalkCard(item) {
    const div = document.createElement('div');
    div.className = 'event-card';
    
    const speakers = item.data.speakers.join(' & ');
    const tagsHtml = item.data.categories.map(cat => `<span class="tag">${cat}</span>`).join('');

    div.innerHTML = `
      <div class="time-slot">
        <span class="start-time">${item.timeRange.split(' - ')[0]}</span>
        <span class="end-time">${item.timeRange.split(' - ')[1]}</span>
      </div>
      <div class="details">
        <h2>${item.data.title}</h2>
        <div class="speakers">by ${speakers}</div>
        <div class="tags">${tagsHtml}</div>
        <p class="description">${item.data.description}</p>
      </div>
    `;
    return div;
  }

  function createBreakCard(item) {
    const div = document.createElement('div');
    div.className = 'break-card';
    div.innerHTML = `${item.timeRange} — ${item.label}`;
    return div;
  }

  function formatTimeRange(startMin, endMin) {
    return `${minutesToTime(startMin)} - ${minutesToTime(endMin)}`;
  }

  function minutesToTime(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12; // Convert 0 to 12
    const displayM = m < 10 ? '0' + m : m;
    return `${displayH}:${displayM} ${period}`;
  }
});
