/**
 * Utility functions for working with notifications across the application
 */

/**
 * Add a notification to the global notification system
 * @param notification The notification to add
 */
export const addNotification = (notification: any) => {
  if (window && (window as any).addHealthNotification) {
    (window as any).addHealthNotification(notification);
    return true;
  }
  return false;
};

/**
 * Create a reminder notification
 * @param title Title of the reminder
 * @param message Message content
 * @param date Date string in ISO format or Date object
 * @param priority Priority level (low, medium, high)
 * @returns A notification object
 */
export const createReminder = (
  title: string, 
  message: string, 
  date: string | Date, 
  priority: 'low' | 'medium' | 'high' = 'medium'
) => {
  const dateStr = date instanceof Date ? date.toISOString() : date;
  
  return {
    id: `reminder-${Date.now()}`,
    type: 'reminder',
    title,
    message,
    date: dateStr,
    isRead: false,
    priority
  };
};

/**
 * Create and add a new reminder to the notification system
 * @param title Title of the reminder
 * @param message Message content
 * @param date Date string in ISO format or Date object
 * @param priority Priority level (low, medium, high)
 * @returns True if successfully added
 */
export const addReminder = (
  title: string, 
  message: string, 
  date: string | Date, 
  priority: 'low' | 'medium' | 'high' = 'medium'
) => {
  const reminder = createReminder(title, message, date, priority);
  return addNotification(reminder);
};

/**
 * Create an appointment notification
 * @param doctorName Name of the healthcare provider
 * @param appointmentDate Date and time of the appointment
 * @param appointmentType Type of appointment (video, chat, in-person)
 * @returns A notification object
 */
export const createAppointmentNotification = (
  doctorName: string,
  appointmentDate: string | Date,
  appointmentType: string = 'appointment'
) => {
  const dateStr = appointmentDate instanceof Date 
    ? appointmentDate.toLocaleString() 
    : new Date(appointmentDate).toLocaleString();
  
  return {
    id: `appt-notification-${Date.now()}`,
    type: 'appointment',
    title: 'Upcoming Appointment',
    message: `You have a ${appointmentType} appointment with ${doctorName} on ${dateStr}.`,
    date: new Date().toISOString(),
    isRead: false,
    priority: 'medium',
    action: {
      label: 'View Appointments',
      link: '/telehealth'
    }
  };
};

/**
 * Create a medication reminder
 * @param medicationName Name of the medication
 * @param dosage Dosage information
 * @param time Time to take the medication
 * @returns A notification object
 */
export const createMedicationReminder = (
  medicationName: string,
  dosage: string,
  time: string | Date
) => {
  const timeStr = time instanceof Date 
    ? time.toLocaleTimeString() 
    : new Date(`2000-01-01T${time}`).toLocaleTimeString();
  
  return {
    id: `med-reminder-${Date.now()}`,
    type: 'medication',
    title: 'Medication Reminder',
    message: `Time to take ${medicationName} (${dosage}) at ${timeStr}.`,
    date: new Date().toISOString(),
    isRead: false,
    priority: 'high'
  };
}; 