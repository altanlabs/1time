export const translations = {
  en: {
    title: "Secure One-Time Message Sharing",
    description: "Share sensitive information securely. Messages self-destruct after being viewed.",
    tabs: {
      message: "Manual Input",
      password: "Password Generator"
    },
    messageInput: {
      placeholder: "Enter your secure message here...",
      createLink: "Create Secure Link",
      creating: "Creating secure link..."
    },
    passwordGen: {
      length: "Password Length",
      includeNumbers: "Include Numbers",
      includeSymbols: "Include Symbols",
      includeUppercase: "Include Uppercase",
      generate: "Generate Password",
      createLink: "Create Secure Link",
      creating: "Creating secure link...",
      generateFirst: "Please generate a password first"
    },
    secureLink: {
      title: "Your Secure Link:",
      expiry: "This link will expire in 24 hours or after being viewed once.",
      copied: "Link copied to clipboard",
      copyError: "Failed to copy link",
      created: "Secure link created successfully"
    },
    viewer: {
      title: "Secure Message",
      oneTime: "One-time view",
      deleteWarning: "This message will be permanently deleted when you leave",
      expired: "This message has expired or has already been viewed.",
      return: "Return Home",
      copied: "Message copied to clipboard",
      copyError: "Failed to copy message",
      loading: "Loading message..."
    },
    errors: {
      noMessage: "Please enter a message",
      createError: "Failed to create secure link",
      loadError: "Failed to load message",
      noId: "No message ID provided",
      serverError: "Server error occurred"
    }
  },
  // ... (rest of the translations remain the same)
} as const;