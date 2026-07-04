export interface BookedSlot {
  booking_time: string; // 'HH:MM:SS'
  duration_minutes: number;
}

export function generateTimeSlots(
  date: Date, 
  durationMinutes: number, 
  bookedSlots: BookedSlot[]
): string[] {
  const dayOfWeek = date.getDay();
  // 0 = Sunday, 1 = Monday ... 6 = Saturday
  
  if (dayOfWeek === 0) return []; // Closed on Sundays

  let startHour = 9; // 9 AM
  let endHour = 19; // 7 PM

  if (dayOfWeek === 6) { // Saturday
    startHour = 10; // 10 AM
    endHour = 17; // 5 PM
  }

  const slots: string[] = [];
  const currentTime = new Date(date);
  currentTime.setHours(startHour, 0, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, 0, 0, 0);

  // Parse booked slots into Date objects for easier comparison
  const bookedRanges = bookedSlots.map(slot => {
    const [hours, minutes] = slot.booking_time.split(':').map(Number);
    const start = new Date(date);
    start.setHours(hours, minutes, 0, 0);
    
    const end = new Date(start.getTime() + slot.duration_minutes * 60000);
    return { start, end };
  });

  // Generate slots in 30-minute intervals
  while (currentTime.getTime() + durationMinutes * 60000 <= endTime.getTime()) {
    const proposedEnd = new Date(currentTime.getTime() + durationMinutes * 60000);
    
    // Check for overlap with existing bookings
    const isOverlapping = bookedRanges.some(booked => {
      // Overlap condition: (StartA < EndB) and (EndA > StartB)
      return (currentTime < booked.end) && (proposedEnd > booked.start);
    });

    // Also check if time has already passed today
    const now = new Date();
    const isPast = date.toDateString() === now.toDateString() && currentTime < now;

    if (!isOverlapping && !isPast) {
      // Format time as HH:MM
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const mins = currentTime.getMinutes().toString().padStart(2, '0');
      slots.push(`${hours}:${mins}`);
    }

    // Increment by 30 mins
    currentTime.setTime(currentTime.getTime() + 30 * 60000);
  }

  return slots;
}

// Map service names to estimated durations in minutes
export function getEstimatedDuration(serviceType: string): number {
  const lower = serviceType.toLowerCase();
  
  if (lower.includes('consultation')) return 30;
  if (lower.includes('botox') || lower.includes('fillers')) return 45;
  if (lower.includes('threads')) return 90;
  if (lower.includes('massage')) return 90;
  if (lower.includes('contouring')) return 90;
  if (lower.includes('class')) return 0; // Academy classes are handled differently
  
  return 60; // Default fallback
}
