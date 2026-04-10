/**
 * Conversation state machine for the WhatsApp feedback flow.
 * States: start → language → confirm_visit → rate_experience → helpdesk → staff_feedback → done
 */

export type FlowState =
  | "start"
  | "language"
  | "confirm_visit"
  | "rate_experience"
  | "helpdesk"
  | "staff_feedback"
  | "done";

export interface BotReply {
  body: string;
  nextState: FlowState;
}

const MESSAGES: Record<string, Record<FlowState | "start", string>> = {
  en: {
    start: `👋 Welcome to Sereno Citizen Feedback!\n\nReply with your preferred language:\n1. Marathi\n2. English\n3. Hindi`,
    language: `🏛️ Did you visit our office today?\n\nReply:\n1. Yes\n2. No`,
    confirm_visit: `⭐ How would you rate your office experience?\n\nReply with a number from 1 (poor) to 5 (excellent).`,
    rate_experience: `🖥️ Was the helpdesk available when you arrived?\n\nReply:\n1. Yes\n2. No`,
    helpdesk: `👤 Please share your feedback on staff behavior (in a few words):`,
    staff_feedback: `💡 Any final suggestions for improving our services? (or type "skip")`,
    done: `✅ Thank you for your valuable feedback! Your response has been recorded.\n\nHave a great day! 🙏`,
  },
  mr: {
    start: `👋 सेरेनो नागरिक अभिप्रायात आपले स्वागत आहे!\n\nआपली भाषा निवडा:\n1. मराठी\n2. इंग्रजी\n3. हिंदी`,
    language: `🏛️ तुम्ही आज आमच्या कार्यालयात आलात का?\n\nउत्तर द्या:\n1. हो\n2. नाही`,
    confirm_visit: `⭐ कार्यालयाच्या अनुभवाला तुम्ही किती गुण द्याल?\n\n1 (खराब) ते 5 (उत्तम) यापैकी एक आकडा टाका.`,
    rate_experience: `🖥️ तुम्ही आल्यावर हेल्पडेस्क उपलब्ध होती का?\n\nउत्तर द्या:\n1. हो\n2. नाही`,
    helpdesk: `👤 कर्मचाऱ्यांच्या वर्तनाबद्दल अभिप्राय द्या (थोडक्यात):`,
    staff_feedback: `💡 आमच्या सेवांमध्ये सुधारण्यासाठी काही सूचना आहेत का? (किंवा "skip" टाका)`,
    done: `✅ आपल्या मौल्यवान अभिप्रायासाठी धन्यवाद! आपला प्रतिसाद नोंदवला गेला आहे.\n\nशुभ दिवस! 🙏`,
  },
  hi: {
    start: `👋 सेरेनो नागरिक फीडबैक में आपका स्वागत है!\n\nअपनी पसंदीदा भाषा चुनें:\n1. मराठी\n2. अंग्रेजी\n3. हिंदी`,
    language: `🏛️ क्या आपने आज हमारे कार्यालय का दौरा किया?\n\nजवाब दें:\n1. हाँ\n2. नहीं`,
    confirm_visit: `⭐ आप अपने कार्यालय के अनुभव को कैसे रेट करेंगे?\n\n1 (खराब) से 5 (उत्कृष्ट) के बीच एक संख्या के साथ उत्तर दें।`,
    rate_experience: `🖥️ क्या आपके आने पर हेल्पडेस्क उपलब्ध था?\n\nजवाब दें:\n1. हाँ\n2. नहीं`,
    helpdesk: `👤 कृपया कर्मचारियों के व्यवहार पर अपनी प्रतिक्रिया साझा करें (कुछ शब्दों में):`,
    staff_feedback: `💡 हमारी सेवाओं में सुधार के लिए कोई अंतिम सुझाव? (या "skip" टाइप करें)`,
    done: `✅ आपकी बहुमूल्य प्रतिक्रिया के लिए धन्यवाद! आपका उत्तर दर्ज कर लिया गया है।\n\nआपका दिन शुभ हो! 🙏`,
  },
};

export function processMessage(
  currentState: FlowState,
  language: string,
  body: string
): BotReply {
  const lang = ["en", "mr", "hi"].includes(language) ? language : "en";
  const trimmed = body.trim().toLowerCase();

  switch (currentState) {
    case "start": {
      // Language selection
      let selectedLang = "en";
      if (trimmed === "1" || trimmed.includes("marathi") || trimmed.includes("मराठी")) {
        selectedLang = "mr";
      } else if (trimmed === "3" || trimmed.includes("hindi") || trimmed.includes("हिंदी")) {
        selectedLang = "hi";
      }
      
      return {
        body: MESSAGES[selectedLang].language,
        nextState: "language",
      };
    }

    case "language": {
      // Confirm visit
      return {
        body: MESSAGES[lang].confirm_visit,
        nextState: "confirm_visit",
      };
    }

    case "confirm_visit": {
      // Rate experience
      return {
        body: MESSAGES[lang].rate_experience,
        nextState: "rate_experience",
      };
    }

    case "rate_experience": {
      // Helpdesk
      return {
        body: MESSAGES[lang].helpdesk,
        nextState: "helpdesk",
      };
    }

    case "helpdesk": {
      // Staff feedback
      return {
        body: MESSAGES[lang].staff_feedback,
        nextState: "staff_feedback",
      };
    }

    case "staff_feedback": {
      // Done
      return {
        body: MESSAGES[lang].done,
        nextState: "done",
      };
    }

    case "done": {
      // Restart
      return {
        body: MESSAGES[lang].start,
        nextState: "start",
      };
    }

    default:
      return {
        body: MESSAGES[lang].start,
        nextState: "start",
      };
  }
}

export function getInitialMessage(language: string): string {
  const lang = language === "mr" ? "mr" : "en";
  return MESSAGES[lang].start;
}
