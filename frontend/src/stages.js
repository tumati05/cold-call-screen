// SINGLE SOURCE OF TRUTH for the eight stages.
// PLACEHOLDER CONTENT: replace names/purpose/prospectSays/options using the
// official one-page structure and what you find in the 100 transcripts.
export const STAGES = [
  {
    no: 1, name: "Opener",
    purpose: "Earn the next ten seconds. Say who you are, briefly, and sound human.",
    prospectSays: ["Who is this?", "I'm busy right now.", "Not interested."],
    options: ["Prospect stayed on the line", "Prospect asked who I am", "Prospect said they are busy", "Prospect hung up"],
  },
  {
    no: 2, name: "Permission",
    purpose: "Ask for a short slice of time so the prospect feels in control.",
    prospectSays: ["You have 30 seconds.", "Send me an email.", "What is this about?"],
    options: ["Gave permission", "Asked for email instead", "Asked what it is about", "Refused"],
  },
  {
    no: 3, name: "Reason for call",
    purpose: "State one clear reason that is relevant to them, not a product list.",
    prospectSays: ["We already have someone for that.", "How did you get my number?", "Go on."],
    options: ["Reason accepted", "Said they already have a vendor", "Questioned how I got the number", "Lost interest"],
  },
  {
    no: 4, name: "Discovery",
    purpose: "Ask questions and listen. Find the problem in their words.",
    prospectSays: ["It's mostly fine, honestly.", "Yes, that has been painful.", "That's not my decision."],
    options: ["Named a real problem", "Said everything is fine", "Said not the decision maker", "Gave short answers"],
  },
  {
    no: 5, name: "Objections",
    purpose: "Acknowledge, do not argue. Understand the real concern behind it.",
    prospectSays: ["Too expensive.", "Bad timing.", "We tried this before."],
    options: ["Objection resolved", "Price objection", "Timing objection", "Past bad experience"],
  },
  {
    no: 6, name: "Pitch",
    purpose: "Connect what you do to the problem they just described. Keep it short.",
    prospectSays: ["How does it work?", "What does it cost?", "Who else uses it?"],
    options: ["Showed interest", "Asked about price", "Asked for proof or references", "Went quiet"],
  },
  {
    no: 7, name: "The ask",
    purpose: "Ask for one specific next step with a date or time.",
    prospectSays: ["Call me next week.", "Send details first.", "Let me think."],
    options: ["Agreed to next step", "Asked for details first", "Asked to call later", "Declined"],
  },
  {
    no: 8, name: "Close",
    purpose: "Confirm what was agreed, thank them, end cleanly.",
    prospectSays: ["Okay, talk soon.", "Please don't call again."],
    options: ["Confirmed next step", "Asked not to be called again", "Left open", "Call ended abruptly"],
  },
];

export const OUTCOMES = [
  ["meeting_booked", "Meeting booked"], ["callback", "Callback set"], ["interested", "Interested"],
  ["not_interested", "Not interested"], ["no_decision", "No decision"], ["hung_up", "Hung up"], ["wrong_person", "Wrong person"],
];
