// SINGLE SOURCE OF TRUTH for the eight stages.
//
// Built from reading 100 cold calls made by one Hyderabad growth-consulting
// company to owners, directors and senior managers. The counts in `evidence`
// are my own tagging of those calls (keyword counts, checked by reading), so
// treat them as "about", not exact. Lines in `prospectSays` are paraphrased,
// not quoted: the transcripts are for this task only and are not published.
//
// The eight stages are inferred from how the calls actually run, in the
// order a call moves. `short` is the label in the stage strip.

export const STAGES = [
  {
    no: 1, name: "Reach the right person", short: "Person",
    purpose:
      "Make sure the person on the line is the person on your list, or get past the front desk to them. Many calls end here, before any pitch.",
    evidence:
      "13 of 100 calls ended as wrong person or moved company, 4 more as call-again because of language or a bad line. 5 went through a front desk that asks your name and reason.",
    prospectSays: [
      "Who is this? Which company?",
      "He (she) left the company a while ago",
      "This number is not theirs / I am in a different job now",
      "Say your name and reason for calling (front desk)",
      "Can we speak in Hindi, Marathi or Kannada?",
    ],
    options: [
      "Right person confirmed",
      "Front desk put me through",
      "Wrong number or wrong person",
      "Person has left the company",
      "Language or bad line, call again",
    ],
  },
  {
    no: 2, name: "Introduce yourself and ask for time", short: "Intro",
    purpose:
      "Say your name and company (Meridian Growth Partners, Hyderabad) slowly, then ask if it is a good time. The company name is the thing prospects most often miss.",
    evidence:
      "In about 4 of 10 calls the prospect asked 'calling from where?' or 'who is this?' in their first few lines. About 1 in 5 calls had a line too poor to follow the first sentence.",
    prospectSays: [
      "Calling from where? Which company?",
      "What is this regarding?",
      "I am driving / in a meeting, call me later",
      "Yes, go ahead",
      "Call me in an hour",
    ],
    options: [
      "Gave me time",
      "Asked me to call back later",
      "Asked who we are again",
      "Busy, driving or in a meeting",
      "Hung up or refused",
    ],
  },
  {
    no: 3, name: "Give the reason for the call", short: "Reason",
    purpose:
      "Say in one or two sentences why you are calling: a free report or profile about their company, or a meeting with the founder. One reason, not a list.",
    evidence:
      "About a third of prospects asked 'what is this regarding?' straight after the opener. Some had never asked for anything, and a few asked where the number came from.",
    prospectSays: [
      "What is this regarding? What is a growth report?",
      "I did not ask for any report",
      "How did you get my number?",
      "Why are you doing this for free?",
      "We are not interested",
    ],
    options: [
      "Reason heard",
      "Asked what the report or profile is",
      "Questioned where we got the number",
      "Said they did not ask for it",
      "Declined, not interested",
    ],
  },
  {
    no: 4, name: "Explain who you are and the offer", short: "Offer",
    purpose:
      "Answer what they actually ask: what Meridian does, whether it costs anything, where the profile is published, who else has had one. Answer, then move on.",
    evidence:
      "About 1 in 10 prospects asked about cost, about 1 in 8 asked 'so you are a consulting firm?' or 'what do you do?', and 14 asked for a website, company profile, client list or sample before saying more.",
    prospectSays: [
      "Is it paid? What are the charges?",
      "So you are a consulting firm?",
      "What do you get out of this?",
      "Where will it be published?",
      "Who else have you done this for? Can I see a sample?",
    ],
    options: [
      "Understood the offer",
      "Asked about cost",
      "Asked what we do or who else we have worked with",
      "Doubts our motive",
      "Wants website or sample first",
    ],
  },
  {
    no: 5, name: "Ask about their growth", short: "Questions",
    purpose:
      "Ask the short yes/no questions: are regular reviews, trying new things and people's growth part of growth, then their goal and the one thing in the way. Not every caller used this stage.",
    evidence:
      "19 of 100 callers asked these questions. Most prospects said yes to the easy ones, then went vague, or said 'we have our own process', at the question about what is in the way.",
    prospectSays: [
      "Yes, reviews and new ideas matter",
      "I cannot share our plans",
      "We have our own internal process",
      "I handle a different area, not growth",
      "Our biggest challenge is hiring skilled people",
    ],
    options: [
      "Answered the questions",
      "Named a goal or an obstacle",
      "Said they cannot share",
      "Said everything is fine",
      "Said it is not their area",
    ],
  },
  {
    no: 6, name: "Handle the push-back", short: "Push-back",
    purpose:
      "Do not argue. Note which kind of push-back it is, take any name or number they offer, and if the door is still open go to the soft ask: send it and I will call back.",
    evidence:
      "About 19 prospects said they were not the right person, 9 said they already had consultants, an internal team or a global contract, and about 2 in 10 asked to be called later. Names of who to talk to (finance head, head office, compliance) came up in at least 8 calls, but a usable contact was given in only a few.",
    prospectSays: [
      "I am not the right person, talk to the CFO or head office",
      "We already have consultants or a global contract",
      "We handle this internally",
      "I do not have time for this",
      "Just send me an email",
    ],
    options: [
      "Gave a name or referral",
      "Already has consultants or an in-house team",
      "Not the decision maker",
      "Not interested",
      "Door still open",
    ],
  },
  {
    no: 7, name: "Ask to send the report", short: "The ask",
    purpose:
      "Ask permission to send the report on WhatsApp or email and confirm where. This is the step most good calls reached. 'Send me the details' is also how many prospects politely end the call, so note which one you got.",
    evidence:
      "Callers asked 'WhatsApp or email?' in about 40 of 100 calls, and 14 calls were logged 'agreed to receive report'. Prospects often set conditions: the official address and not the one on the profile, a different WhatsApp number, or your company profile and website first.",
    prospectSays: [
      "Send it on WhatsApp",
      "Email me, use my official address",
      "Send your company profile and website first",
      "Not this number, use my other WhatsApp",
      "Send a sample first",
    ],
    options: [
      "Agreed: WhatsApp",
      "Agreed: email",
      "Wants company profile or sample first",
      "Gave a different number or address",
      "Would not share an address",
    ],
  },
  {
    no: 8, name: "Fix the next step and close", short: "Next step",
    purpose:
      "Name the next step with a day and time: your call back, or a meeting with the founder. Repeat what was agreed, thank them, end. Then log the outcome the way the prospect actually left it.",
    evidence:
      "Only 11 of 100 calls were logged 'next step agreed' (a set meeting, a call at a set time, or report plus follow-up call). 14 were just 'follow up'. Prospects who gave a time usually named a weekday and asked for a phone call, not a video meeting.",
    prospectSays: [
      "Call me next Tuesday afternoon",
      "Let me read it first, then we will see",
      "A phone call is fine, not a video call",
      "Call me tomorrow after 3",
      "Please do not call again",
    ],
    options: [
      "Day and time fixed",
      "Meeting with the founder agreed",
      "Will read first, no time fixed",
      "Asked to call back later",
      "Asked not to be called again",
    ],
  },
];

// The caller's own outcome words from the data, in the order of the data's README.
// `hint` is the meaning the callers gave each word. It is shown on the button
// because in the data the logged word often did not match what happened on the
// call (e.g. polite declines and even agreed calls logged as "do not call").
export const OUTCOMES = [
  ["agreed_to_receive_report", "Agreed to receive report", "They agreed to a document on WhatsApp or email"],
  ["next_step_agreed", "Next step agreed", "A meeting, a call at a set time, or report plus follow-up call"],
  ["interested", "Interested", "They said so, but no fixed next step"],
  ["follow_up", "Follow up", "You are to call again"],
  ["call_again", "Call again", "Call the number again (language or bad line)"],
  ["not_interested", "Not interested", "They declined"],
  ["do_not_call", "Do not call", "Only if they asked not to be called"],
  ["wrong_person", "Wrong person", "Not the person listed, or not the right person"],
  ["moved_company", "Moved company", "No longer works at the listed company"],
];
