/**
 * Calendar Utility
 * Generates a downloadable .ics calendar event file
 */

export function generateICS(config, variant = 'party') {
  const isChurch = variant === 'church';
  const { groomName, brideName, date, time, church } = config;

  const eventTitle = isChurch
    ? `Wedding Ceremony of ${groomName} & ${brideName}`
    : `Wedding of ${groomName} & ${brideName}`;
  const location = `${church.name}, ${church.area}`;

  // Parse date and time
  const [year, month, day] = date.split('-');
  const [hour, minute] = time.split(':');

  // Create start date in UTC (Cairo is UTC+2, but we'll use local time format)
  const startDate = `${year}${month}${day}T${hour}${minute}00`;
  // End time: 3 hours for ceremony only, 5 hours for ceremony + reception
  const durationHours = isChurch ? 3 : 5;
  const endHour = String(parseInt(hour, 10) + durationHours).padStart(2, '0');
  const endDate = `${year}${month}${day}T${endHour}${minute}00`;

  const description = isChurch
    ? `You are invited to the wedding ceremony of ${groomName} & ${brideName}.`
    : `You are invited to the wedding ceremony and reception of ${groomName} & ${brideName}.`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART;TZID=Africa/Cairo:${startDate}`,
    `DTEND;TZID=Africa/Cairo:${endDate}`,
    `SUMMARY:${eventTitle}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    `UID:${Date.now()}@wedding-invitation`,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${eventTitle} starts in 1 hour`,
    'END:VALARM',
    'END:VEVENT',
    'BEGIN:VTIMEZONE',
    'TZID:Africa/Cairo',
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0200',
    'TZNAME:EET',
    'END:STANDARD',
    'END:VTIMEZONE',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `wedding-${groomName.toLowerCase()}-${brideName.toLowerCase()}${isChurch ? '-ceremony' : ''}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
