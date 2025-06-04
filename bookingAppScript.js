let allSlots = [];
let availableDaysSet = new Set();
let selectedDate = null;
let selectedSlot = null;

let today = new Date();
let visibleYear = today.getFullYear();
let visibleMonth = today.getMonth();

// Descriptions for types, fetched from server
const descriptions = {
  "Pre Call": "",
  Podcast: ""
};

function showLoading(show, message = "Loading Calendar") {
  const overlay = document.getElementById("loading-overlay");
  overlay.textContent = message;
  overlay.style.display = show ? "flex" : "none";
}

function loadDescriptions() {
  google.script
    .run
    .withSuccessHandler((descObj) => {
      descriptions["Pre Call"] = descObj["Pre Call"] || "";
      descriptions["Podcast"] = descObj["Podcast"] || "";
      updateDescription();
    })
    .withFailureHandler(() => {
      descriptions["Pre Call"] = "";
      descriptions["Podcast"] = "";
      updateDescription();
    })
    .getDescriptions();
}

function updateDescription() {
  const type = document.getElementById("type").value;
  const descDiv = document.getElementById("podcast-description");
  descDiv.textContent = descriptions[type] || "";
}

function loadSlots() {
  showLoading(true);
  const type = document.getElementById("type").value;

  // Reset selections & UI parts
  selectedDate = null;
  selectedSlot = null;
  clearSlots();
  hideBookingForm();

  google.script
    .run
    .withSuccessHandler((slots) => {
      allSlots = slots;
      buildAvailableDaysSet();
      buildCalendar();
      showLoading(false);
    })
    .withFailureHandler((err) => {
      alert("Error loading slots: " + err.message);
      showLoading(false);
    })
    .getAvailableSlots(type);

  updateDescription();
}

function buildAvailableDaysSet() {
  availableDaysSet = new Set();
  allSlots.forEach((slot) => {
    const dayStr = slot.start.split("T")[0];
    availableDaysSet.add(dayStr);
  });
}

function buildCalendar() {
  const calendarContainer = document.getElementById("calendar-container");
  calendarContainer.innerHTML = "";

  const monthYearLabel = document.getElementById("month-year-label");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  monthYearLabel.textContent = `${monthNames[visibleMonth]} ${visibleYear}`;

  // Remove previous weekday headers (if any) and add new ones
  const weekdaysRow = document.createElement("div");
  weekdaysRow.className = "calendar-weekdays";
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
    const span = document.createElement("span");
    span.textContent = day;
    weekdaysRow.appendChild(span);
  });
  calendarContainer.appendChild(weekdaysRow);

  const firstDayOfMonth = new Date(visibleYear, visibleMonth, 1);
  const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();

  const maxDate = new Date(today.getTime());
  maxDate.setDate(today.getDate() + 29);

  const startDayOfWeek = firstDayOfMonth.getDay();
  let currentDay = new Date(visibleYear, visibleMonth, 1 - startDayOfWeek);

  // Show 6 weeks (42 days)
  for (let i = 0; i < 42; i++) {
    const dayDiv = document.createElement("span");
    dayDiv.classList.add("calendar-day");

    const y = currentDay.getFullYear();
    const m = currentDay.getMonth() + 1;
    const d = currentDay.getDate();
    const dayStr = `${y}-${m.toString().padStart(2, "0")}-${d
      .toString()
      .padStart(2, "0")}`;

    dayDiv.textContent = d;

    if (currentDay < today || currentDay > maxDate) {
      dayDiv.classList.add("unavailable");
      dayDiv.style.cursor = "default";
    } else if (currentDay.getMonth() !== visibleMonth) {
      dayDiv.classList.add("unavailable");
      dayDiv.style.cursor = "default";
    } else if (availableDaysSet.has(dayStr)) {
      dayDiv.classList.add("available");
      dayDiv.onclick = () => selectDate(dayStr, dayDiv);
    } else {
      dayDiv.classList.add("unavailable");
      dayDiv.style.cursor = "default";
    }

    if (selectedDate === dayStr) {
      dayDiv.classList.add("selected");
    }

    calendarContainer.appendChild(dayDiv);

    currentDay.setDate(currentDay.getDate() + 1);
  }
}

function selectDate(dayStr, dayDiv) {
  selectedDate = dayStr;
  selectedSlot = null;
  clearBookingForm();

  document.querySelectorAll(".calendar-day.selected").forEach((el) => {
    el.classList.remove("selected");
  });
  dayDiv.classList.add("selected");

  showSlotsForDate(dayStr);
}

function showSlotsForDate(dayStr) {
  const container = document.getElementById("slots-container");
  container.innerHTML = "";

  const slotsForDay = allSlots.filter((slot) => slot.start.startsWith(dayStr));

  if (slotsForDay.length === 0) {
    container.textContent = "No slots available for this day.";
    hideBookingForm();
    return;
  }

  slotsForDay.forEach((slot) => {
    const startTime = new Date(slot.start);
    const endTime = new Date(slot.end);

    const formattedStart = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedEnd = endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary";
    btn.textContent = `${formattedStart} - ${formattedEnd}`;

    btn.onclick = () => {
      selectedSlot = slot;
      // Highlight selected slot button
      document.querySelectorAll("#slots-container button").forEach((b) =>
        b.classList.remove("selected")
      );
      btn.classList.add("selected");

      // Show booking form
      showBookingForm();
    };

    container.appendChild(btn);
  });
}

function clearSlots() {
  const container = document.getElementById("slots-container");
  container.innerHTML = "";
}

function showBookingForm() {
  document.getElementById("booking-form").style.display = "block";
}

function hideBookingForm() {
  document.getElementById("booking-form").style.display = "none";
}

function submitBooking() {
  if (!selectedSlot) {
    alert("Please select a slot.");
    return;
  }

  const email = document.getElementById("email").value.trim();
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  showLoading(true, "Booking...");

  const meetingType = document.getElementById("type").value;

  google.script
    .run
    .withSuccessHandler(() => {
      showLoading(false);
      alert("Booking successful!");
      resetForm();
      loadSlots(); // reload to update availability
    })
    .withFailureHandler((err) => {
      showLoading(false);
      alert("Error booking: " + err.message);
    })
    .bookMeeting(selectedSlot.start, selectedSlot.end, email, meetingType);
}

function resetForm() {
  selectedDate = null;
  selectedSlot = null;
  document.getElementById("email").value = "";
  document.querySelectorAll(".calendar-day.selected").forEach((el) =>
    el.classList.remove("selected")
  );
  clearSlots();
  hideBookingForm();
}

function prevMonth() {
  if (visibleMonth === 0) {
    visibleMonth = 11;
    visibleYear--;
  } else {
    visibleMonth--;
  }
  buildCalendar();
}

function nextMonth() {
  if (visibleMonth === 11) {
    visibleMonth = 0;
    visibleYear++;
  } else {
    visibleMonth++;
  }
  buildCalendar();
}

window.onload = () => {
  loadDescriptions();
  loadSlots();
};
