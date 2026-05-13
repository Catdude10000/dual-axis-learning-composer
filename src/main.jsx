import React from "react";
import { createRoot } from "react-dom/client";
import {
  Clipboard,
  RefreshCcw,
  Sparkles,
  Target,
  Layers,
  Route,
  BookOpen,
  Info,
  Brain,
  CheckCircle2,
  HelpCircle,
  ArrowUpRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  MoveLeft,
  MoveRight
} from "lucide-react";
import {
  getCorpusById,
  getRecommendedCorpusItems,
  mapDokTargetsToCognitiveTargets,
  searchCorpus
} from "./data/knowledgeCorpus";
import ModeToggle from "./components/ModeToggle";
import "./styles.css";

const audiences = [
  "Middle School",
  "High School",
  "College Non-Major",
  "College Major",
  "General Public",
  "Museum Staff"
];

const durations = ["1 day", "3 days", "1 week", "2 weeks", "4 weeks", "6 weeks"];
const masteryThresholds = ["Basic satisfactory", "Strong understanding", "Transfer-ready"];
const adaptivePathStyles = ["Gentle scaffold", "Balanced", "Productive struggle", "Peer/cooperative learning"];
const subModuleCreationModes = ["Auto-create sub-module", "Custom-design sub-module", "Hybrid / designer-guided auto-create"];
const cognitiveDepthLevels = [
  {
    id: 1,
    key: "recognition",
    label: "Recognition",
    shortLabel: "Recognize",
    description: "Identify, recall, name, notice, or locate basic information.",
    dokMapping: "Webb DOK 1",
    bloomMapping: "Remember",
    exampleMuseumTask: "Identify the purpose of the Free Breakfast Program."
  },
  {
    id: 2,
    key: "comprehension",
    label: "Comprehension",
    shortLabel: "Explain",
    description: "Explain meaning, summarize, describe relationships, or interpret basic significance.",
    dokMapping: "Webb DOK 1-2",
    bloomMapping: "Understand",
    exampleMuseumTask: "Explain how the Free Breakfast Program addressed a community need."
  },
  {
    id: 3,
    key: "application",
    label: "Application",
    shortLabel: "Apply",
    description: "Use knowledge in a guided task or apply an idea to a concrete example.",
    dokMapping: "Webb DOK 2",
    bloomMapping: "Apply",
    exampleMuseumTask: "Apply the survival-program model to a present-day community issue."
  },
  {
    id: 4,
    key: "strategic-analysis",
    label: "Strategic Analysis",
    shortLabel: "Analyze",
    description: "Compare, reason, analyze causes/effects, justify claims, or evaluate evidence.",
    dokMapping: "Webb DOK 3",
    bloomMapping: "Analyze / Evaluate",
    exampleMuseumTask: "Analyze why Panther survival programs were both social services and political education."
  },
  {
    id: 5,
    key: "integrative-transfer",
    label: "Integrative Transfer",
    shortLabel: "Transfer",
    description: "Connect ideas across contexts, synthesize sources, or design a solution for a new situation.",
    dokMapping: "Webb DOK 3-4",
    bloomMapping: "Evaluate / Create",
    exampleMuseumTask: "Design a modern community survival program inspired by Panther history."
  },
  {
    id: 6,
    key: "reflective-mastery",
    label: "Reflective Mastery",
    shortLabel: "Reflect",
    description: "Reflect on changed understanding, revise assumptions, teach another learner, or explain how one knows.",
    dokMapping: "Webb DOK 4 + metacognition",
    bloomMapping: "Create / Reflect",
    exampleMuseumTask: "Explain how your view of community self-determination changed and why."
  }
];
const accessibilityLevels = ["Basic", "Guided", "General", "Specific", "Referential", "Applied", "Encyclopedic", "Archival"];
const cognitiveLevelOptions = cognitiveDepthLevels.map((level) => level.label);
const masteryCognitiveTargets = ["adaptive", ...cognitiveLevelOptions];
const movementOptions = ["Yes, adaptive movement encouraged", "Limited movement only", "No, keep sequence mostly upward"];
const slideCountOptions = ["1", "2", "3", "4", "5", "Custom"];
const navigatorDockOptions = ["below map", "top-right", "bottom-right"];
const learnerVisualStyleOptions = [
  "Actual image with overlay",
  "Image beside text",
  "Generated placeholder",
  "Text only"
];
const slideTypes = [
  { value: "content", label: "Content" },
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "true_false", label: "True / false" },
  { value: "fill_blank", label: "Fill-in-the-blank" },
  { value: "short_essay", label: "Short essay" },
  { value: "reflection", label: "Reflection" },
  { value: "discussion", label: "Discussion" }
];
const slideTypeLabels = Object.fromEntries(slideTypes.map((type) => [type.value, type.label]));
const masteryStatusLabels = {
  not_started: "Not started",
  in_progress: "In progress",
  mastered: "Mastered",
  needs_support: "Needs support"
};
const learningLocusLevels = [
  {
    id: 1,
    key: "big-ideas-core-tasks",
    label: "Big Ideas and Core Tasks",
    shortLabel: "Big Ideas",
    description:
      "Central concepts, transfer goals, and core learner actions that support enduring understanding and mastery.",
    pedagogicalRole: "transfer / mastery / strategic meaning-making",
    symbol: "\u2605"
  },
  {
    id: 2,
    key: "important-to-know-and-do",
    label: "Important to Know and Do",
    shortLabel: "Important",
    description:
      "Supporting concepts and learner practices that reinforce major ideas and applications.",
    pedagogicalRole: "conceptual support / guided application",
    symbol: "\u25c6"
  },
  {
    id: 3,
    key: "worth-being-familiar-with",
    label: "Worth Being Familiar With",
    shortLabel: "Familiarity",
    description:
      "Contextual, illustrative, or supplementary information that enriches understanding.",
    pedagogicalRole: "context / enrichment / immersion",
    symbol: "\u25c9"
  }
];
const learningLocusOptions = ["Auto-evaluate", ...learningLocusLevels.map((level) => level.label)];
const learningLocusWeightingOptions = ["Balanced", "Transfer-focused", "Mastery-focused", "Relationship-focused"];

// Add actual uploaded Black Panther Party Museum photos at /public/images/
// using these filenames. If a file is missing, Course View detects the failed
// load and renders an intentional generated-image-style placeholder instead.
const museumImages = [
  {
    id: "research-room",
    title: "Dr. Huey P. Newton Research Room",
    themes: ["research", "theory", "praxis", "archives", "archive", "Huey Newton", "study", "sources", "bibliography"],
    src: "/images/research-room.jpg"
  },
  {
    id: "free-breakfast-program",
    title: "People's Free Food Program",
    themes: ["breakfast", "food", "feeding", "children", "survival", "survival programs", "community care", "mutual aid"],
    src: "/images/free-breakfast-program.jpg"
  },
  {
    id: "ten-point-program",
    title: "Ten-Point Program",
    themes: ["ten-point program", "political education", "demands", "freedom", "platform", "rights"],
    src: "/images/ten-point-program.jpg"
  },
  {
    id: "huey-newton-theory-praxis",
    title: "Huey Newton: Theory and Praxis",
    themes: ["Huey Newton", "theory", "praxis", "political education", "research", "archive"],
    src: "/images/huey-newton-theory-praxis.jpg"
  },
  {
    id: "safe-program",
    title: "S.A.F.E. Program",
    themes: ["SAFE", "seniors", "safety", "elder care", "community safety", "self-determination"],
    src: "/images/safe-program.jpg"
  },
  {
    id: "oscar-grant-phone-booth",
    title: "Oscar Grant Phone Booth",
    themes: ["Oscar Grant", "police violence", "memorial", "phone booth", "public memory", "justice"],
    src: "/images/oscar-grant-phone-booth.jpg"
  },
  {
    id: "black-panther-books-table",
    title: "Black Panther Books and Research Table",
    themes: ["books", "research", "sources", "bibliography", "reading", "archives", "education"],
    src: "/images/black-panther-books-table.jpg"
  },
  {
    id: "medical-care-display",
    title: "Medical Care Display",
    themes: ["medical care", "health", "clinic", "doctor", "sickle-cell", "care", "survival"],
    src: "/images/medical-care-display.jpg"
  },
  {
    id: "newspaper-media",
    title: "Movement Newspaper and Media",
    themes: ["newspaper", "media", "communication", "visual rhetoric", "publication", "headline", "archives", "education"],
    src: "/images/newspaper-media.jpg"
  }
];

const visualKeywordGroups = {
  breakfast: ["breakfast", "food", "feeding", "children", "meal", "meals", "free food", "community care", "survival program", "survival programs"],
  research: ["research", "huey", "newton", "archive", "archives", "archival", "theory", "praxis", "study", "documents"],
  platform: ["ten-point", "ten point", "program", "demands", "freedom", "rights", "political education", "platform"],
  health: ["health", "medical", "clinic", "care", "sickle", "screening", "public health"],
  media: ["newspaper", "media", "flyer", "article", "communication", "visual rhetoric", "headline", "publication"],
  education: ["education", "school", "learning", "discussion", "reflection", "museum", "public memory", "teach"],
  safety: ["police", "violence", "safety", "surveillance", "elder", "seniors", "self-determination", "response"]
};

const imageKeywordAliases = {
  "free-breakfast-program": visualKeywordGroups.breakfast,
  "research-room": visualKeywordGroups.research,
  "huey-newton-theory-praxis": visualKeywordGroups.research,
  "ten-point-program": visualKeywordGroups.platform,
  "medical-care-display": visualKeywordGroups.health,
  "newspaper-media": visualKeywordGroups.media,
  "black-panther-books-table": [...visualKeywordGroups.research, ...visualKeywordGroups.education],
  "safe-program": visualKeywordGroups.safety,
  "oscar-grant-phone-booth": visualKeywordGroups.safety
};

const phaseArc = [
  "Phase 1: orient learners through essential terms, context, and recognition.",
  "Phase 2: apply concepts to concrete community needs and policy questions.",
  "Phase 3: compare sources, strategies, and forms of civic learning.",
  "Phase 4: analyze systems, stakeholders, narratives, and institutional response.",
  "Phase 5: transfer the model into new settings through synthesis and design.",
  "Phase 6: evaluate memory, evidence, civic meaning, and learner reflection."
];

const basePhaseNodes = {
  1: [
    { title: "What was the Free Breakfast Program?", dok: 1, access: "General", learningLocusKey: "big-ideas-core-tasks" },
    { title: "Key vocabulary: mutual aid, survival program, community care", dok: 1, access: "Basic", learningLocusKey: "important-to-know-and-do" }
  ],
  2: [
    { title: "How did the program meet community needs?", dok: 2, access: "Specific", learningLocusKey: "big-ideas-core-tasks" },
    { title: "Connect food insecurity to public policy", dok: 2, access: "General", learningLocusKey: "important-to-know-and-do" },
    { title: "Identify evidence of community care", dok: 3, access: "Specific", learningLocusKey: "worth-being-familiar-with" }
  ],
  3: [
    { title: "Compare direct service and political education", dok: 3, access: "Referential", learningLocusKey: "big-ideas-core-tasks" },
    { title: "Analyze a primary source flyer", dok: 3, access: "Specific", learningLocusKey: "important-to-know-and-do" },
    { title: "Trace audience, message, and setting", dok: 4, access: "Referential", learningLocusKey: "worth-being-familiar-with" }
  ],
  4: [
    { title: "Map stakeholders and institutional responses", dok: 4, access: "Referential", learningLocusKey: "big-ideas-core-tasks" },
    { title: "Assess media narratives about the program", dok: 4, access: "Encyclopedic", learningLocusKey: "important-to-know-and-do" },
    { title: "Explain tensions between service and surveillance", dok: 3, access: "Referential", learningLocusKey: "worth-being-familiar-with" }
  ],
  5: [
    { title: "Transfer the model to a modern community program", dok: 5, access: "Encyclopedic", learningLocusKey: "big-ideas-core-tasks" },
    { title: "Design a local mutual-aid concept", dok: 5, access: "Referential", learningLocusKey: "important-to-know-and-do" },
    { title: "Synthesize lessons across eras", dok: 4, access: "Specific", learningLocusKey: "worth-being-familiar-with" }
  ],
  6: [
    { title: "Evaluate the program as civic pedagogy", dok: 6, access: "Archival", learningLocusKey: "big-ideas-core-tasks" },
    { title: "Reflect on how historical memory shapes public learning", dok: 6, access: "Encyclopedic", learningLocusKey: "important-to-know-and-do" },
    { title: "Build a capstone interpretation from evidence", dok: 5, access: "Archival", learningLocusKey: "worth-being-familiar-with" }
  ]
};

const sampleConcepts = [
  {
    id: "free-breakfast-program",
    title: "Free Breakfast Program",
    dokTarget: "2-3",
    accessibility: "Guided / Specific",
    theme: "community survival programs, food justice, mutual aid",
    node: {
      title: "Free Breakfast Program: Mutual Aid and Food Justice",
      dok: 3,
      access: "Specific",
      learningLocusKey: "big-ideas-core-tasks"
    },
    mainScreen: {
      title: "Free Breakfast Program: Community Care as Civic Learning",
      concept:
        "Learners examine how the Black Panther Party's Free Breakfast Program responded to hunger while also teaching communities about dignity, public responsibility, and self-determination.",
      activityPrompt:
        "Identify one community need the program addressed, then explain how meeting that need could also become political education.",
      checkForUnderstandingPrompt:
        "How did the Free Breakfast Program combine direct service with a broader message about community power and food justice?",
      masteryCriteria:
        "Learner can connect food access, mutual aid, and civic education using historically respectful language.",
      imagePrompt:
        "Create a black-and-white halftone museum slide image showing community members sharing breakfast in a respectful historical educational style, with no real person likenesses."
    },
    needsSupportPath: [
      {
        dokLevel: 1,
        accessibilityLevel: "Guided",
        purpose: "review",
        screenTitle: "What was the Free Breakfast Program?",
        content: "Review the basic purpose: the program provided free meals for children while centering community care.",
        activityPrompt: "Name the basic need this program addressed and one group it served."
      },
      {
        dokLevel: 2,
        accessibilityLevel: "Guided",
        purpose: "scaffold",
        screenTitle: "How did breakfast become mutual aid?",
        content: "This screen links a concrete service, food, to the broader idea of neighbors organizing to meet shared needs.",
        activityPrompt: "Complete the sentence: The program was mutual aid because..."
      },
      {
        dokLevel: 2,
        accessibilityLevel: "Specific",
        purpose: "practice",
        screenTitle: "Match community need to Panther response",
        content: "Learners connect food insecurity, school readiness, and community organizing to specific program responses.",
        activityPrompt: "Match each need with one response the program made visible."
      },
      {
        dokLevel: 3,
        accessibilityLevel: "Specific",
        purpose: "apply",
        screenTitle: "Explain why the program was politically significant",
        content: "Learners move from description toward interpretation by explaining why direct service carried civic meaning.",
        activityPrompt: "Write two sentences explaining why feeding children could also challenge public systems."
      },
      {
        dokLevel: 3,
        accessibilityLevel: "Applied",
        purpose: "reflect",
        screenTitle: "Connect food justice to a present-day community need",
        content: "Learners reflect on how the historical example can inform museum conversations about food justice today.",
        activityPrompt: "What modern community problem could a similar program help people discuss?"
      }
    ],
    challengePath: [
      {
        dokLevel: 3,
        accessibilityLevel: "Referential",
        purpose: "extend",
        screenTitle: "Compare survival programs and public welfare",
        content: "Learners compare grassroots service with government responsibility without flattening historical context.",
        activityPrompt: "What question would help visitors compare community aid and public policy fairly?"
      },
      {
        dokLevel: 4,
        accessibilityLevel: "Applied",
        purpose: "apply",
        screenTitle: "Design a museum prompt about food justice",
        content: "Learners design an interpretive prompt that links historical evidence to present-day civic agency.",
        activityPrompt: "Draft a museum discussion question that connects the program to food justice today."
      },
      {
        dokLevel: 4,
        accessibilityLevel: "Archival",
        purpose: "reflect",
        screenTitle: "Defend an interpretation from evidence",
        content: "Learners explain what evidence would be needed to support a nuanced museum interpretation.",
        activityPrompt: "Name two kinds of evidence that would strengthen your interpretation."
      }
    ]
  },
  {
    id: "ten-point-program",
    title: "Ten-Point Program",
    dokTarget: "3",
    accessibility: "Referential",
    theme: "political demands, civic agency, historical interpretation",
    node: {
      title: "Ten-Point Program: Demands and Civic Agency",
      dok: 3,
      access: "Referential",
      learningLocusKey: "big-ideas-core-tasks"
    },
    mainScreen: {
      title: "Ten-Point Program: Reading Demands as Civic Agency",
      concept:
        "Learners interpret the Ten-Point Program as a public statement of political demands, community priorities, and civic imagination in its historical context.",
      activityPrompt:
        "Choose one demand and explain what community concern it names, then identify what kind of change it calls for.",
      checkForUnderstandingPrompt:
        "How can a political demand help museum visitors understand both historical conditions and community agency?",
      masteryCriteria:
        "Learner can interpret a demand as both historical evidence and a statement of civic purpose.",
      imagePrompt:
        "Create a black-and-white halftone museum slide image of a respectful archival-style document display with bold text fragments, civic meeting energy, and no real person likenesses."
    },
    needsSupportPath: [
      {
        dokLevel: 1,
        accessibilityLevel: "Guided",
        purpose: "review",
        screenTitle: "What is a political demand?",
        content: "Review how a demand names a problem and asks for a specific form of change.",
        activityPrompt: "Underline the problem and circle the requested change in a sample demand."
      },
      {
        dokLevel: 2,
        accessibilityLevel: "Specific",
        purpose: "scaffold",
        screenTitle: "Connect one demand to a community concern",
        content: "Learners practice connecting text to historical needs such as housing, education, work, or safety.",
        activityPrompt: "Select one demand and complete: This demand responds to..."
      },
      {
        dokLevel: 3,
        accessibilityLevel: "Specific",
        purpose: "practice",
        screenTitle: "Interpret a demand as historical evidence",
        content: "Learners explain what a demand reveals about community priorities and historical conditions.",
        activityPrompt: "Write one claim about what this demand helps us understand."
      },
      {
        dokLevel: 3,
        accessibilityLevel: "Referential",
        purpose: "reflect",
        screenTitle: "Why does historical context matter?",
        content: "Learners consider how interpretation changes when a demand is read inside its time and place.",
        activityPrompt: "Name one context clue a museum visitor would need before judging the demand."
      }
    ],
    challengePath: [
      {
        dokLevel: 4,
        accessibilityLevel: "Referential",
        purpose: "extend",
        screenTitle: "Compare two demands across civic themes",
        content: "Learners compare demands to identify patterns in rights, resources, and self-determination.",
        activityPrompt: "Compare two demands. What larger civic idea connects them?"
      },
      {
        dokLevel: 4,
        accessibilityLevel: "Applied",
        purpose: "apply",
        screenTitle: "Curate a museum label for one demand",
        content: "Learners craft an interpretive label that avoids oversimplification and invites historical thinking.",
        activityPrompt: "Write a 40-word museum label that frames one demand respectfully and historically."
      },
      {
        dokLevel: 4,
        accessibilityLevel: "Archival",
        purpose: "reflect",
        screenTitle: "Defend a historical interpretation",
        content: "Learners explain what evidence supports their reading and what questions remain open.",
        activityPrompt: "What evidence would you cite, and what question would you still ask?"
      }
    ]
  },
  {
    id: "safe-program",
    title: "S.A.F.E. Program / Seniors Against a Fearful Environment",
    dokTarget: "2-4",
    accessibility: "Specific / Applied",
    theme: "community safety, elder care, self-determination",
    node: {
      title: "S.A.F.E. Program: Elder Care and Community Safety",
      dok: 3,
      access: "Applied",
      learningLocusKey: "big-ideas-core-tasks"
    },
    mainScreen: {
      title: "S.A.F.E. Program: Safety, Elder Care, and Self-Determination",
      concept:
        "Learners examine Seniors Against a Fearful Environment as a community safety effort that connected elder care, protection, and self-determination.",
      activityPrompt:
        "Explain how a safety program for seniors can reflect both practical care and a larger vision of community responsibility.",
      checkForUnderstandingPrompt:
        "What does the S.A.F.E. Program suggest about who is responsible for safety, care, and dignity in a community?",
      masteryCriteria:
        "Learner can connect elder care, community safety, and self-determination without reducing the program to a simple service.",
      imagePrompt:
        "Create a black-and-white halftone museum slide image showing a respectful intergenerational community safety scene, elder care, and neighborhood solidarity, with no real person likenesses."
    },
    needsSupportPath: [
      {
        dokLevel: 1,
        accessibilityLevel: "Guided",
        purpose: "review",
        screenTitle: "What did S.A.F.E. focus on?",
        content: "Review the basic idea that the program focused on safety and support for seniors.",
        activityPrompt: "Name one safety concern seniors might face in a community."
      },
      {
        dokLevel: 2,
        accessibilityLevel: "Specific",
        purpose: "scaffold",
        screenTitle: "Connect elder care to community responsibility",
        content: "Learners connect practical help for seniors to broader ideas of collective care.",
        activityPrompt: "Complete: A community shows responsibility to elders when..."
      },
      {
        dokLevel: 2,
        accessibilityLevel: "Applied",
        purpose: "practice",
        screenTitle: "Plan a respectful safety response",
        content: "Learners identify a practical response that protects dignity rather than creating fear.",
        activityPrompt: "Choose one safety concern and suggest one respectful community response."
      },
      {
        dokLevel: 3,
        accessibilityLevel: "Applied",
        purpose: "apply",
        screenTitle: "Explain safety as self-determination",
        content: "Learners explain how community-led safety differs from relying only on outside institutions.",
        activityPrompt: "Write two sentences connecting safety, elder care, and self-determination."
      },
      {
        dokLevel: 4,
        accessibilityLevel: "Applied",
        purpose: "reflect",
        screenTitle: "Design a museum question about care and safety",
        content: "Learners create a visitor-facing question that links the historical program to contemporary community care.",
        activityPrompt: "Draft one question that would invite visitors to think about safety and dignity today."
      }
    ],
    challengePath: [
      {
        dokLevel: 4,
        accessibilityLevel: "Applied",
        purpose: "extend",
        screenTitle: "Analyze competing ideas of safety",
        content: "Learners compare institution-centered and community-centered approaches to safety.",
        activityPrompt: "What values are emphasized by each approach, and what tradeoffs should visitors notice?"
      },
      {
        dokLevel: 4,
        accessibilityLevel: "Archival",
        purpose: "apply",
        screenTitle: "Build an evidence plan for S.A.F.E.",
        content: "Learners identify what sources would help a museum interpret the program responsibly.",
        activityPrompt: "List three source types that could document the program's goals, impact, and community meaning."
      },
      {
        dokLevel: 4,
        accessibilityLevel: "Applied",
        purpose: "reflect",
        screenTitle: "Connect elder care to civic self-determination",
        content: "Learners synthesize the historical example into a respectful present-day civic question.",
        activityPrompt: "How could this history shape a conversation about elder care now?"
      }
    ]
  }
];

const slideVariants = [
  {
    lens: "community care",
    action: "notice how practical support can also teach civic responsibility",
    task: "Name one present-day community program that addresses a basic need. What civic or political message might it communicate?"
  },
  {
    lens: "public learning",
    action: "connect evidence, lived experience, and institutional response",
    task: "Choose one piece of evidence this node would need. What question should learners ask before interpreting it?"
  },
  {
    lens: "historical interpretation",
    action: "separate what happened, how it was represented, and why it is remembered",
    task: "Write a one-sentence museum label that invites visitors to think beyond a simple summary."
  }
];

function enrichNodeWithLearningLocus(node, weightingPreference = "Balanced", overrideLabel = "Auto-evaluate") {
  const overrideLevel = getLearningLocusByLabel(overrideLabel);
  const evaluation = evaluateLearningLocus(node, weightingPreference);
  const level = overrideLevel ?? evaluation.level;
  return {
    ...node,
    learningLocusKey: level.key,
    learningLocusLabel: level.label,
    learningLocusShortLabel: level.shortLabel,
    learningLocusRationale: overrideLevel
      ? `Locked by curriculum designer as ${level.label}.`
      : evaluation.rationale,
    learningLocusScore: evaluation.score
  };
}

function makeNodes(form, halftonePromptPercent = 20, locusSettings = {}) {
  const template = basePhaseNodes[form.phase] ?? basePhaseNodes[1];
  // Deterministic local generation keeps the prototype explainable and API-free.
  const nodes = template.map((node, index) => ({
    ...node,
    id: `phase-${form.phase}-${index}-${node.dok}-${node.access}`,
    phase: Number(form.phase),
    audience: form.audience,
    duration: form.duration,
    theme: form.theme,
    goal: form.goal,
    cognitiveDepthLevel: node.dok,
    relatedConcepts: [form.theme, node.title].filter(Boolean),
    prerequisiteFor: node.learningLocusKey === "big-ideas-core-tasks" ? ["mastery checkpoint", "adaptive sub-module"] : [],
    supportsTransferAcrossModules: node.dok >= 4 || /transfer|design|compare|analyze/i.test(node.title)
  }));
  return assignHalftonePrompts(
    nodes.map((node) => enrichNodeWithLearningLocus(node, locusSettings.weightingPreference, locusSettings.overrideLabel)),
    halftonePromptPercent
  );
}

function makeSampleNode(sample, form, halftonePromptPercent = 20, locusSettings = {}) {
  const node = {
    ...sample.node,
    id: `sample-${sample.id}`,
    phase: Number(form.phase),
    audience: form.audience,
    duration: form.duration,
    theme: sample.theme,
    goal: `Use ${sample.title} to demonstrate mastery learning with prepared support and challenge paths.`,
    sampleConceptId: sample.id,
    cognitiveDepthLevel: sample.node.dok,
    relatedConcepts: sample.theme.split(",").map((item) => item.trim()),
    prerequisiteFor: ["sample mastery path"],
    supportsTransferAcrossModules: true
  };
  return assignHalftonePrompts(
    [enrichNodeWithLearningLocus(node, locusSettings.weightingPreference, locusSettings.overrideLabel)],
    halftonePromptPercent
  )[0];
}

function makeCorpusNode(item, form, halftonePromptPercent = 20, locusSettings = {}) {
  const cognitiveTargets = item.cognitiveTargets ?? mapDokTargetsToCognitiveTargets(item.dokTargets);
  const dok = getCognitiveIdFromSetting(cognitiveTargets[cognitiveTargets.length - 1], clamp(item.dokTargets[item.dokTargets.length - 1] ?? 3, 1, 6));
  const access = item.accessibilityTargets[item.accessibilityTargets.length - 1] ?? "Specific";
  const node = {
    title: item.title,
    dok,
    access,
    learningLocusKey: item.category.includes("Framework") ? "important-to-know-and-do" : "big-ideas-core-tasks",
    id: `corpus-${item.id}`,
    phase: Number(form.phase),
    audience: form.audience,
    duration: form.duration,
    theme: item.category,
    goal: `Use ${item.title} from the knowledge corpus to support module design and mastery learning.`,
    corpusItemId: item.id,
    dokMapping: item.dokTargets,
    cognitiveTargets,
    cognitiveDepthLevel: dok,
    relatedConcepts: [...item.learningUses, item.category],
    prerequisiteFor: item.learningUses.filter((use) => /mastery|assessment|module|design|analysis/.test(use)),
    supportsTransferAcrossModules: item.learningUses.some((use) => /transfer|comparison|design|contemporary|modern/.test(use))
  };
  return assignHalftonePrompts(
    [enrichNodeWithLearningLocus(node, locusSettings.weightingPreference, locusSettings.overrideLabel)],
    halftonePromptPercent
  )[0];
}

function makeSlide(node, variantIndex) {
  const sample = sampleConcepts.find((concept) => concept.id === node.sampleConceptId);
  if (sample) {
    return {
      title: sample.mainScreen.title,
      concept: sample.mainScreen.concept,
      why: `${sample.title} is a strong mastery-learning example because it asks learners to move between concrete community needs, historical interpretation, and civic meaning.`,
      task: sample.mainScreen.activityPrompt,
      deeper: [
        `Cognitive target: ${sample.dokTarget
          .split("-")
          .map((level) => getCognitiveLabel(Number(level)))
          .join(" to ")}`,
        `Accessibility: ${sample.accessibility}`,
        `Theme: ${sample.theme}`
      ],
      prompt: node.imagePrompt,
      checkForUnderstandingPrompt: sample.mainScreen.checkForUnderstandingPrompt,
      masteryCriteria: sample.mainScreen.masteryCriteria
    };
  }

  const corpusItem = getCorpusById(node.corpusItemId);
  if (corpusItem) {
    return {
      title: corpusItem.title,
      concept: corpusItem.summary,
      why: `This corpus item supports ${corpusItem.learningUses.join(", ")} while keeping the module grounded in visible source material.`,
      task: corpusItem.suggestedPrompts[0],
      deeper: corpusItem.suggestedPrompts.slice(1),
      prompt: node.imagePrompt,
      checkForUnderstandingPrompt: corpusItem.suggestedPrompts[1] ?? `Explain why ${corpusItem.title} matters for this learning module.`,
      masteryCriteria: `Learner can use ${corpusItem.title} for ${corpusItem.learningUses[0]} and connect it to the module's cognitive/accessibility target.`,
      sources: corpusItem.sources,
      category: corpusItem.category,
      learningUses: corpusItem.learningUses,
      cognitiveTargets: corpusItem.cognitiveTargets ?? mapDokTargetsToCognitiveTargets(corpusItem.dokTargets)
    };
  }

  const variant = slideVariants[variantIndex % slideVariants.length];
  // A few repeatable variants simulate regeneration without calling a model.
  const titleMap = {
    "How did the program meet community needs?": "Community Care as Political Education",
    "What was the Free Breakfast Program?": "Introducing a Survival Program",
    "Compare direct service and political education": "Service, Strategy, and Civic Learning",
    "Evaluate the program as civic pedagogy": "Evaluating Civic Pedagogy Through Memory"
  };

  return {
    title: titleMap[node.title] ?? node.title,
    concept: `${node.title} asks ${node.audience.toLowerCase()} learners to examine ${node.theme} through the lens of ${variant.lens}. In this learning moment, the selected evidence and discussion prompt help learners ${variant.action}. The activity is scaled for a ${node.duration} experience and aligned to ${getCognitiveLevel(node.dok).description.toLowerCase()}`,
    why: "This matters because the topic is not only historical content; it is a way to reason about responsibility, justice, power, and public memory. Learners can see how knowledge becomes more meaningful as it moves from familiar context toward deeper evidence.",
    task: variant.task,
    deeper: [
      "Compare survival programs with public welfare programs.",
      "Examine a primary source image, flyer, article, or oral history excerpt.",
      "Discuss how media framing can shape public memory."
    ],
    prompt: node.imagePrompt
  };
}

function makeDefaultSlideSettings(node, slideIndex = 0) {
  const basePrompt = `Respond to "${node.title}" using one specific detail from the learning slide.`;
  const typeCycle = ["content", "multiple_choice", "true_false", "fill_blank", "short_essay", "reflection", "discussion"];
  const slideType = slideIndex === 0 ? "content" : typeCycle[slideIndex % typeCycle.length];
  return {
    slideType,
    multipleChoice: {
      choices: [
        "It connected a practical community need with civic learning.",
        "It avoided public questions and focused only on private memory.",
        "It removed the need to interpret historical evidence."
      ],
      correctIndex: 0,
      feedback: "Good. This answer connects direct service, evidence, and civic meaning."
    },
    trueFalse: {
      correctAnswer: "true",
      feedback: "Right direction: the strongest answer should connect the activity to evidence and community meaning."
    },
    fillBlank: {
      prompt: `${node.title} helps learners understand that ______ can become a form of public learning.`,
      expectedAnswer: "community care, mutual aid, or direct service"
    },
    shortEssay: {
      prompt: basePrompt,
      criteria: "Uses evidence, explains civic meaning, and avoids oversimplifying historical context."
    },
    reflection: {
      prompt: `What changed in your thinking after studying "${node.title}"?`,
      partnerPrompt: "Share one changed assumption with a partner and compare the evidence that influenced each of you."
    },
    discussion: {
      prompt: `What question should a museum educator ask to help visitors discuss "${node.title}" respectfully?`,
      partnerPrompt: "In pairs, choose one discussion norm that would make this conversation more careful and historically grounded."
    },
    manualContent: {
      title: "",
      concept: "",
      why: "",
      task: "",
      deeper: "",
      imagePrompt: ""
    }
  };
}

function getSlideKey(nodeId, slideIndex) {
  return `${nodeId}::${slideIndex}`;
}

function normalizeSlideCountSetting(setting) {
  const mode = setting?.mode ?? "2";
  if (mode === "Custom") return clamp(Number(setting?.customCount) || 1, 1, 12);
  return clamp(Number(mode) || 1, 1, 5);
}

function getPhaseSlideSetting(phaseSlideSettings, phase) {
  return phaseSlideSettings[Number(phase)] ?? { mode: "2", customCount: 2 };
}

function getSlideSettings(slideSettingsByKey, node, slideIndex) {
  return slideSettingsByKey[getSlideKey(node.id, slideIndex)] ?? makeDefaultSlideSettings(node, slideIndex);
}

function buildSlideGenerationContext({
  node,
  form,
  selectedCorpusItems,
  masterySettings,
  learningLocus,
  slideIndex,
  slideCount,
  slideSettings
}) {
  const corpusItems = selectedCorpusItems.length
    ? selectedCorpusItems
    : node.corpusItemId
      ? [getCorpusById(node.corpusItemId)].filter(Boolean)
      : [];
  const corpusFocus = corpusItems.map((item) => item.title).join(", ");
  const corpusUses = corpusItems.flatMap((item) => item.learningUses ?? []).slice(0, 4);
  return {
    audience: form.audience,
    theme: form.theme,
    goal: form.goal,
    phase: Number(node.phase ?? form.phase),
    slideNumber: slideIndex + 1,
    slideCount,
    slideType: slideSettings.slideType,
    slideTypeLabel: slideTypeLabels[slideSettings.slideType],
    cognitiveLevel: getCognitiveLabel(node.dok),
    cognitiveDescription: getCognitiveLevel(node.dok).description,
    accessLevel: node.access,
    learningLocus,
    masteryThreshold: masterySettings.masteryThreshold,
    adaptivePathStyle: masterySettings.adaptivePathStyle,
    includePartnerPrompts: masterySettings.includePartnerPrompts,
    halftonePromptPercent: masterySettings.halftonePromptPercent,
    nodeTitle: node.title,
    nodeTheme: node.theme,
    corpusFocus,
    corpusUses
  };
}

function generateAssessmentPrompt(context) {
  const evidenceCue = context.corpusFocus ? ` using ${context.corpusFocus}` : "";
  if (context.slideType === "multiple_choice") {
    return `Which response best connects ${context.nodeTitle} to ${context.learningLocus.label.toLowerCase()}${evidenceCue}?`;
  }
  if (context.slideType === "true_false") {
    return `${context.nodeTitle} should be interpreted through both evidence and civic meaning.`;
  }
  if (context.slideType === "fill_blank") {
    return `${context.nodeTitle} helps learners see that ______ can shape public memory and community learning.`;
  }
  if (context.slideType === "short_essay") {
    return `Explain how ${context.nodeTitle} advances the learning goal for ${context.audience.toLowerCase()} learners. Use one source, concept, or example.`;
  }
  if (context.slideType === "reflection") {
    return `What changed in your thinking about ${context.theme} after working with ${context.nodeTitle}?`;
  }
  if (context.slideType === "discussion") {
    return `What question would help a partner discuss ${context.nodeTitle} with historical care and curiosity?`;
  }
  return `How does ${context.nodeTitle} support the learning goal: ${context.goal}`;
}

function generateFeedbackForSlideType(context) {
  const target = `${context.cognitiveLevel} / ${context.accessLevel}`;
  return {
    correct: `Correct. This response connects the slide focus to ${context.learningLocus.label} while staying aligned to ${target}.`,
    incorrect: `Not quite. Revisit how the slide asks you to connect evidence, learner action, and ${context.learningLocus.shortLabel.toLowerCase()} understanding.`,
    general: `Strong responses should use evidence, name the civic or museum-learning meaning, and meet the ${context.masteryThreshold.toLowerCase()} threshold.`
  };
}

function generateImagePrompt(context) {
  const sourceCue = context.corpusFocus ? ` Reference the learning source focus: ${context.corpusFocus}.` : "";
  return `Create a classroom-safe, historically respectful educational image inspired by Black Panther Party Museum learning about "${context.nodeTitle}" within "${context.theme}". Emphasize community care, political education, source-based interpretation, and museum objects or spaces rather than real person likenesses.${sourceCue} Use a warm documentary style with subtle halftone texture and clear space for overlay text for ${context.audience.toLowerCase()} learners.`;
}

function generateSlideContent(context) {
  const feedback = generateFeedbackForSlideType(context);
  const assessmentPrompt = generateAssessmentPrompt(context);
  const sourcePhrase = context.corpusFocus
    ? ` The slide draws on ${context.corpusFocus} to keep interpretation anchored in source-informed learning.`
    : "";
  const titlePrefix = {
    content: "Understand",
    multiple_choice: "Choose Evidence For",
    true_false: "Test the Claim",
    fill_blank: "Complete the Connection",
    short_essay: "Explain",
    reflection: "Reflect on",
    discussion: "Discuss"
  }[context.slideType];
  const concept = `In Phase ${context.phase}, ${context.audience.toLowerCase()} learners examine ${context.nodeTitle} as part of "${context.theme}." This slide targets ${context.cognitiveLevel} with ${context.accessLevel.toLowerCase()} knowledge access, asking learners to ${context.cognitiveDescription.toLowerCase()} The learning-locus emphasis is ${context.learningLocus.label.toLowerCase()}, so the activity keeps attention on ${context.learningLocus.description.toLowerCase()}${sourcePhrase}`;
  const why = `This matters because the learning goal is not just to remember content, but to use ${context.nodeTitle} to reason about evidence, community meaning, and public interpretation. The ${context.adaptivePathStyle.toLowerCase()} mastery design keeps learners moving toward ${context.masteryThreshold.toLowerCase()} without losing the larger course arc.`;
  const task = assessmentPrompt;
  const deeper = [
    `Connect this slide to the course goal: ${context.goal}`,
    context.corpusUses.length ? `Use a source as evidence for ${context.corpusUses[0]}.` : `Name one piece of evidence a museum educator should add next.`,
    `Extend the idea toward ${context.learningLocus.shortLabel.toLowerCase()} learning by explaining what a learner should be able to do after this slide.`
  ];
  const interaction = {
    slideType: context.slideType,
    multipleChoice: {
      choices: [
        `It connects ${context.nodeTitle} to evidence, learner action, and civic meaning.`,
        `It treats ${context.nodeTitle} as a detail to memorize without interpretation.`,
        `It removes source context so learners can answer faster.`,
        `It asks learners to ignore the ${context.accessLevel.toLowerCase()} access target.`
      ],
      correctIndex: 0,
      feedback: feedback.correct
    },
    trueFalse: {
      correctAnswer: "true",
      feedback: feedback.correct
    },
    fillBlank: {
      prompt: assessmentPrompt,
      expectedAnswer: `${context.learningLocus.shortLabel.toLowerCase()} understanding, evidence, community meaning, or public memory`
    },
    shortEssay: {
      prompt: assessmentPrompt,
      criteria: feedback.general
    },
    reflection: {
      prompt: assessmentPrompt,
      partnerPrompt: context.includePartnerPrompts
        ? `Compare your reflection with a partner. Where did you use similar evidence, and where did your interpretations differ?`
        : ""
    },
    discussion: {
      prompt: assessmentPrompt,
      partnerPrompt: context.includePartnerPrompts
        ? `Invite a partner to answer first, then build on their idea with one source-informed detail.`
        : ""
    },
    manualContent: makeDefaultSlideSettings({ title: context.nodeTitle }, context.slideNumber - 1).manualContent
  };

  return {
    title: `${titlePrefix} ${context.nodeTitle}`,
    concept,
    why,
    task,
    deeper,
    prompt: generateImagePrompt(context),
    checkForUnderstandingPrompt: assessmentPrompt,
    masteryCriteria: feedback.general,
    interaction
  };
}

function applyManualContent(baseSlide, slideSettings) {
  const manual = slideSettings.manualContent ?? {};
  return {
    ...baseSlide,
    title: manual.title || baseSlide.title,
    concept: manual.concept || baseSlide.concept,
    why: manual.why || baseSlide.why,
    task: manual.task || baseSlide.task,
    deeper: manual.deeper ? manual.deeper.split("\n").map((item) => item.trim()).filter(Boolean) : baseSlide.deeper,
    prompt: manual.imagePrompt || baseSlide.prompt
  };
}

function makeLearningSlide(node, variantIndex, slideIndex = 0, slideSettings, dynamicGenerationEnabled = false, generationContext = null) {
  const baseSlide = makeSlide(node, variantIndex + slideIndex);
  const settings = slideSettings ?? makeDefaultSlideSettings(node, slideIndex);
  const generatedSlide = dynamicGenerationEnabled && generationContext ? generateSlideContent(generationContext) : null;
  const ordinal = slideIndex + 1;
  const titleSuffix = ordinal > 1 ? `: Slide ${ordinal}` : "";
  const sourceSlide = generatedSlide ?? applyManualContent(baseSlide, settings);
  const interaction = generatedSlide?.interaction ?? settings;
  return {
    ...sourceSlide,
    title: `${sourceSlide.title}${titleSuffix}`,
    concept:
      ordinal > 1 && !generatedSlide
        ? `${sourceSlide.concept} This slide extends the module with a focused ${slideTypeLabels[settings.slideType].toLowerCase()} activity.`
        : sourceSlide.concept,
    task: settings.slideType === "content" ? sourceSlide.task : getInteractivePrompt(interaction, sourceSlide.task),
    slideIndex,
    slideType: settings.slideType,
    interaction,
    dynamicGenerated: !!generatedSlide
  };
}

function getInteractivePrompt(settings, fallbackTask) {
  if (settings.slideType === "multiple_choice") return "Choose the strongest response, then review the feedback.";
  if (settings.slideType === "true_false") return "Decide whether the statement is true or false, then review the feedback.";
  if (settings.slideType === "fill_blank") return settings.fillBlank.prompt;
  if (settings.slideType === "short_essay") return settings.shortEssay.prompt;
  if (settings.slideType === "reflection") return settings.reflection.prompt;
  if (settings.slideType === "discussion") return settings.discussion.prompt;
  return fallbackTask;
}

function getVisualSearchText({ form, selectedNode, slide, selectedCorpusItems }) {
  return [
    form.theme,
    form.goal,
    selectedNode.title,
    selectedNode.theme,
    slide.title,
    slide.slideType,
    slide.concept,
    slide.task,
    selectedNode.corpusItemId,
    ...selectedCorpusItems.map((item) => `${item.title} ${item.category} ${item.summary} ${(item.learningUses ?? []).join(" ")}`)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function normalizeVisualText(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTokenMatchScore(searchText, phrase) {
  const normalizedPhrase = normalizeVisualText(phrase);
  if (!normalizedPhrase) return 0;
  if (searchText.includes(normalizedPhrase)) return normalizedPhrase.split(" ").length + 3;
  const phraseTokens = normalizedPhrase.split(/[\s-]+/).filter((token) => token.length > 2);
  if (!phraseTokens.length) return 0;
  return phraseTokens.reduce((score, token) => {
    if (searchText.includes(token)) return score + 1;
    const fuzzyHit = searchText.split(" ").some((searchToken) => searchToken.length > 4 && (searchToken.includes(token) || token.includes(searchToken)));
    return score + (fuzzyHit ? 0.5 : 0);
  }, 0);
}

function selectMuseumImage({ visualSettings, form, selectedNode, slide, selectedCorpusItems }) {
  if (!visualSettings.autoPopulate && visualSettings.selectedImageId === "text-only") return null;
  if (visualSettings.selectedImageId && visualSettings.selectedImageId !== "auto") {
    return museumImages.find((image) => image.id === visualSettings.selectedImageId) ?? null;
  }
  if (!visualSettings.autoPopulate) return null;

  const searchText = normalizeVisualText(getVisualSearchText({ form, selectedNode, slide, selectedCorpusItems }));
  const scoredImages = museumImages.map((image) => {
    const keywords = [...image.themes, ...(imageKeywordAliases[image.id] ?? [])];
    const score = keywords.reduce((total, keyword) => total + getTokenMatchScore(searchText, keyword), 0);
    const phase = Number(selectedNode.phase);
    const phaseBoost =
      (phase <= 2 && image.id === "free-breakfast-program") ||
      (phase === 3 && image.id === "newspaper-media") ||
      (phase === 4 && (image.id === "safe-program" || image.id === "oscar-grant-phone-booth")) ||
      (phase >= 5 && (image.id === "black-panther-books-table" || image.id === "huey-newton-theory-praxis"))
        ? 2
        : 0;
    const slideBoost =
      slide.slideType === "discussion" || slide.slideType === "reflection"
        ? image.id === "black-panther-books-table"
          ? 2
          : 0
        : 0;
    return { image, score: score + phaseBoost + slideBoost };
  });

  return scoredImages.sort((first, second) => second.score - first.score)[0]?.image ?? museumImages[0];
}

function getCourseVisual({ visualSettings, form, selectedNode, slide, selectedCorpusItems }) {
  const image = selectMuseumImage({ visualSettings, form, selectedNode, slide, selectedCorpusItems });
  const selectedSpecificImage = visualSettings.selectedImageId && !["auto", "text-only"].includes(visualSettings.selectedImageId);
  const style = visualSettings.visualStyle === "Halftone background with text overlay" ? "Actual image with overlay" : visualSettings.visualStyle;
  return {
    image,
    style,
    caption: visualSettings.caption || image?.title || selectedNode.theme,
    imagePrompt: visualSettings.imagePrompt || slide.prompt,
    sourceLabel: image
      ? `${selectedSpecificImage ? "Selected image" : "Auto-selected image"}: ${image.id}`
      : "Fallback generated visual"
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getDokFromSetting(value, fallbackDok) {
  return getCognitiveIdFromSetting(value, fallbackDok);
}

function getAccessIndex(accessibilityLevel) {
  return Math.max(0, accessibilityLevels.indexOf(accessibilityLevel));
}

function getCognitiveLevel(id) {
  return cognitiveDepthLevels.find((level) => level.id === clamp(Number(id) || 1, 1, 6)) ?? cognitiveDepthLevels[0];
}

function getCognitiveLabel(id) {
  return getCognitiveLevel(id).label;
}

function getCognitiveShortLabel(id) {
  return getCognitiveLevel(id).shortLabel;
}

function getCognitiveIdFromSetting(value, fallbackLevel = 3) {
  if (!value || value === "adaptive") return fallbackLevel;
  const directMatch = cognitiveDepthLevels.find((level) => level.label === value || level.shortLabel === value || level.key === value);
  if (directMatch) return directMatch.id;
  const numberMatch = String(value).match(/\d+/);
  return numberMatch ? clamp(Number(numberMatch[0]), 1, 6) : fallbackLevel;
}

function getLearningLocusByKey(key) {
  return learningLocusLevels.find((level) => level.key === key) ?? learningLocusLevels[1];
}

function getLearningLocusByLabel(label) {
  return learningLocusLevels.find((level) => level.label === label || level.shortLabel === label);
}

function getLearningLocusFromComponent(component) {
  return getLearningLocusByKey(component.learningLocusKey);
}

function evaluateLearningLocus(component, weightingPreference = "Balanced") {
  let score = 0;
  const rationale = [];
  const cognitiveLevel = clamp(component.cognitiveDepthLevel ?? component.dok ?? component.dokLevel ?? 2, 1, 6);
  const relatedCount = component.relatedConcepts?.length ?? 0;
  const prerequisiteCount = component.prerequisiteFor?.length ?? 0;
  const text = [component.title, component.concept, component.goal, component.theme, component.activityPrompt]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const supportsTransfer = component.supportsTransferAcrossModules || cognitiveLevel >= 5 || /transfer|design|modern|apply|create|synthesize/.test(text);
  const requiredForLaterLearning = component.requiredForLaterLearning || prerequisiteCount > 0 || /key vocabulary|core|foundation|essential/.test(text);
  const requiresLearnerAction = component.requiresLearnerAction || /design|compare|analyze|explain|apply|reflect|create|map|practice/.test(text);
  const connectsMultipleConcepts = component.connectsMultipleConcepts || relatedCount >= 2 || /connect|relationship|compare|across|systems|between/.test(text);
  const isReflectiveOrMetacognitive = component.isReflectiveOrMetacognitive || cognitiveLevel === 6 || /reflect|self-knowledge|meaning|changed understanding/.test(text);
  const isMostlyContextual = component.isMostlyContextual || /date|name|visual detail|contextual artifact|supplementary|vocabulary/.test(text);
  const strategicMeaningMaking = cognitiveLevel >= 4;

  const weights = {
    transfer: weightingPreference === "Transfer-focused" ? 5 : 4,
    dependency: weightingPreference === "Mastery-focused" ? 5 : 4,
    action: 3,
    relationship: weightingPreference === "Relationship-focused" ? 4 : 3,
    reflection: 2,
    strategic: 3,
    contextPenalty: weightingPreference === "Balanced" ? -2 : -1
  };

  if (supportsTransfer) {
    score += weights.transfer;
    rationale.push("supports transfer across contexts");
  }
  if (requiredForLaterLearning) {
    score += weights.dependency;
    rationale.push("supports later learning or mastery dependencies");
  }
  if (requiresLearnerAction) {
    score += weights.action;
    rationale.push("requires active learner practice or application");
  }
  if (connectsMultipleConcepts) {
    score += weights.relationship;
    rationale.push("connects multiple concepts or module relationships");
  }
  if (isReflectiveOrMetacognitive) {
    score += weights.reflection;
    rationale.push("invites reflection or metacognitive mastery");
  }
  if (strategicMeaningMaking) {
    score += weights.strategic;
    rationale.push("uses strategic analysis, transfer, or reflective depth");
  }
  if (isMostlyContextual) {
    score += weights.contextPenalty;
    rationale.push("is mainly contextual or familiarity-building");
  }

  const level = score >= 9 ? learningLocusLevels[0] : score >= 4 ? learningLocusLevels[1] : learningLocusLevels[2];
  const autoLevel = component.learningLocusKey ? getLearningLocusByKey(component.learningLocusKey) : level;
  return {
    score,
    level: autoLevel,
    rationale: `Assigned to ${autoLevel.label} because this component ${rationale.length ? rationale.join(", ") : "provides useful curriculum context"}.`
  };
}

function stableHash(value) {
  return String(value)
    .split("")
    .reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) % 100000, 7);
}

function makeHalftoneImagePrompt(screen) {
  return `Create a black-and-white halftone museum slide image about "${screen.title}" connected to ${screen.theme ?? screen.concept ?? "Black Panther Party community history"}. Use an archival educational style, high contrast newspaper print texture, respectful historical tone, no real person likenesses, and clean space for museum-learning text.`;
}

function assignHalftonePrompts(screens, percent) {
  const normalizedPercent = clamp(Number(percent) || 0, 0, 100);
  if (!screens.length || normalizedPercent <= 0) return screens.map((screen) => ({ ...screen, imagePrompt: "" }));

  const promptCount = normalizedPercent === 100 ? screens.length : Math.max(1, Math.round((screens.length * normalizedPercent) / 100));
  const selectedIds = new Set(
    [...screens]
      .sort((first, second) => stableHash(first.id ?? first.title) - stableHash(second.id ?? second.title))
      .slice(0, promptCount)
      .map((screen) => screen.id ?? screen.title)
  );

  return screens.map((screen) => ({
    ...screen,
    imagePrompt: selectedIds.has(screen.id ?? screen.title) ? screen.imagePrompt || makeHalftoneImagePrompt(screen) : ""
  }));
}

function parsePathList(value, fallback) {
  const items = String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : fallback;
}

function makeCustomSubModule(parentScreen, designerSettings) {
  const titles = parsePathList(designerSettings.customScreenPrompts, [
    "Review the parent concept",
    "Practice with guided evidence",
    "Apply the concept",
    "Reflect on museum meaning"
  ]);
  const dokPath = parsePathList(designerSettings.customDokPath, [
    "Recognition",
    "Application",
    getCognitiveLabel(parentScreen.cognitiveDepthLevel ?? parentScreen.dokLevel),
    getCognitiveLabel(parentScreen.cognitiveDepthLevel ?? parentScreen.dokLevel)
  ]).map((level) => getCognitiveIdFromSetting(level, parentScreen.cognitiveDepthLevel ?? parentScreen.dokLevel));
  const accessPath = parsePathList(designerSettings.customAccessibilityPath, [
    "Guided",
    "Specific",
    parentScreen.accessibilityLevel,
    "Applied"
  ]);

  const learningPath = titles.slice(0, 5).map((title, index) => ({
    dokLevel: dokPath[index % dokPath.length],
    accessibilityLevel: accessibilityLevels.includes(accessPath[index % accessPath.length])
      ? accessPath[index % accessPath.length]
      : parentScreen.accessibilityLevel,
    purpose: index === 0 ? "review" : index === titles.length - 1 ? "reflect" : index === 1 ? "practice" : "apply",
    screenTitle: title,
    content: `Custom-designed screen for "${designerSettings.customSubModuleTitle}" connected to ${parentScreen.concept}.`,
    activityPrompt: title
  }));

  const screens = learningPath.map((pathNode, index) => makeAdaptiveScreen(parentScreen, pathNode, index, designerSettings));
  return {
    id: `${parentScreen.id}-custom-mastery-path`,
    parentModuleId: "custom-designed",
    parentScreenId: parentScreen.id,
    targetConcept: designerSettings.customTargetConcept || parentScreen.concept,
    title: designerSettings.customSubModuleTitle || `Custom Mastery Path: ${parentScreen.concept}`,
    creationMode: "Custom-design sub-module",
    designerPreferredZone: {
      cognitiveLevel: designerSettings.customDokPath,
      accessibilityLevel: designerSettings.customAccessibilityPath,
      pathStyle: designerSettings.adaptivePathStyle,
      threshold: designerSettings.masteryThreshold
    },
    screens: assignHalftonePrompts(screens, designerSettings.halftonePromptPercent),
    learningPath,
    rationale:
      "This custom-designed sub-module branches from the parent learning phase to support mastery before the learner returns to the main module."
  };
}

function makeLearningScreen(node, slide, status = "not_started") {
  return {
    id: node.id,
    title: slide.title,
    concept: node.title,
    sampleConceptId: node.sampleConceptId,
    corpusItemId: node.corpusItemId,
    dokLevel: clamp(node.dok, 1, 6),
    cognitiveDepthLevel: clamp(node.dok, 1, 6),
    cognitiveLevel: getCognitiveLabel(node.dok),
    dokMapping: getCognitiveLevel(node.dok).dokMapping,
    accessibilityLevel: node.access,
    content: slide.concept,
    activityPrompt: slide.task,
    checkForUnderstandingPrompt:
      slide.checkForUnderstandingPrompt ??
      `In your own words, explain how "${node.title}" connects historical evidence to community learning.`,
    masteryCriteria:
      slide.masteryCriteria ??
      "Learner can name the core idea, use at least one piece of evidence, and explain why the concept matters.",
    imagePrompt: node.imagePrompt ?? slide.prompt,
    learningLocusKey: node.learningLocusKey,
    learningLocusLabel: node.learningLocusLabel,
    learningLocusShortLabel: node.learningLocusShortLabel,
    learningLocusRationale: node.learningLocusRationale,
    status
  };
}

function makeAdaptiveScreen(parentScreen, pathNode, index, designerSettings) {
  const partnerPrompts = [
    "Compare your interpretation with a partner.",
    "Co-create a one-sentence explanation.",
    "Partner A explains the historical context; Partner B explains the modern connection."
  ];
  const partnerPrompt =
    designerSettings.includePartnerPrompts || designerSettings.adaptivePathStyle === "Peer/cooperative learning"
      ? partnerPrompts[index % partnerPrompts.length]
      : "";

  return {
    id: `${parentScreen.id}-mastery-${index + 1}`,
    title: pathNode.screenTitle,
    concept: parentScreen.concept,
    dokLevel: pathNode.dokLevel,
    cognitiveDepthLevel: clamp(pathNode.dokLevel, 1, 6),
    cognitiveLevel: getCognitiveLabel(pathNode.dokLevel),
    dokMapping: getCognitiveLevel(pathNode.dokLevel).dokMapping,
    accessibilityLevel: pathNode.accessibilityLevel,
    content:
      pathNode.content ??
      `AI-generated draft: This ${pathNode.purpose} screen revisits "${parentScreen.concept}" with ${pathNode.accessibilityLevel.toLowerCase()} supports at the ${getCognitiveLabel(pathNode.dokLevel)} level.`,
    activityPrompt:
      pathNode.activityPrompt ??
      (pathNode.purpose === "reflect"
        ? `Reflect on how this museum concept changes the way visitors understand community care, power, or public memory.`
        : `Use the provided context to respond to "${pathNode.screenTitle}" in two or three precise sentences.`),
    checkForUnderstandingPrompt: `What would count as strong evidence for your answer about "${parentScreen.concept}"?`,
    masteryCriteria: "Response is historically grounded, uses the screen prompt directly, and shows readiness to return to the main module.",
    partnerPrompt,
    imagePrompt:
      pathNode.imagePrompt ??
      `Create a black-and-white halftone museum slide image about "${pathNode.screenTitle}" in an archival educational style. Use high contrast newspaper print texture, respectful historical tone, no real person likenesses, and clear space for exhibit text.`,
    status: "not_started"
  };
}

function generateMasterySubModule(parentScreen, designerSettings, learnerChoice) {
  if (designerSettings.subModuleCreationMode === "Custom-design sub-module") {
    return makeCustomSubModule(parentScreen, designerSettings);
  }

  const sample = sampleConcepts.find((concept) => concept.id === parentScreen.sampleConceptId);
  if (sample) {
    const learningPath = learnerChoice === "challenge" ? sample.challengePath : sample.needsSupportPath;
    const screens = learningPath.map((pathNode, index) => makeAdaptiveScreen(parentScreen, pathNode, index, designerSettings));
    return {
      id: `${parentScreen.id}-${learnerChoice}-sample-mastery-path`,
      parentModuleId: "sample-concepts",
      parentScreenId: parentScreen.id,
      targetConcept: sample.title,
      title: `${sample.title} Mastery Sub-Module`,
      creationMode: designerSettings.subModuleCreationMode,
      designerPreferredZone: {
        cognitiveLevel: sample.dokTarget
          .split("-")
          .map((level) => getCognitiveLabel(Number(level)))
          .join(" to "),
        accessibilityLevel: sample.accessibility,
        pathStyle: designerSettings.adaptivePathStyle,
        threshold: designerSettings.masteryThreshold
      },
      screens: assignHalftonePrompts(screens, designerSettings.halftonePromptPercent),
      learningPath,
      rationale:
        learnerChoice === "challenge"
          ? `This sample challenge path moves ${sample.title} toward higher cognitive-depth interpretation, transfer, and evidence-based reflection.`
          : `This sample support path temporarily increases scaffolding before returning the learner to ${sample.title} as a target concept.`
    };
  }

  const corpusItem = getCorpusById(parentScreen.corpusItemId);
  if (corpusItem) {
    const supportPath = [
      {
        dokLevel: getCognitiveIdFromSetting(mapDokTargetsToCognitiveTargets([corpusItem.dokTargets[0] ?? 1])[0], 1),
        accessibilityLevel: corpusItem.accessibilityTargets[0] ?? "Guided",
        purpose: "review",
        screenTitle: `Review: ${corpusItem.title}`,
        content: corpusItem.summary,
        activityPrompt: corpusItem.suggestedPrompts[0]
      },
      {
        dokLevel: getCognitiveIdFromSetting(mapDokTargetsToCognitiveTargets([corpusItem.dokTargets[1] ?? 2])[1], 2),
        accessibilityLevel: corpusItem.accessibilityTargets[1] ?? "Specific",
        purpose: "scaffold",
        screenTitle: `Use the source base for ${corpusItem.title}`,
        content: `This screen scaffolds ${corpusItem.learningUses[0]} using the recommended source corpus.`,
        activityPrompt: corpusItem.suggestedPrompts[1] ?? corpusItem.suggestedPrompts[0]
      },
      {
        dokLevel: clamp(parentScreen.cognitiveDepthLevel ?? parentScreen.dokLevel, 1, 6),
        accessibilityLevel: parentScreen.accessibilityLevel,
        purpose: "practice",
        screenTitle: `Practice with ${corpusItem.title}`,
        content: `Learners use the corpus summary and source links to build a grounded response.`,
        activityPrompt: corpusItem.suggestedPrompts[2] ?? corpusItem.suggestedPrompts[0]
      },
      {
        dokLevel: clamp(parentScreen.cognitiveDepthLevel ?? parentScreen.dokLevel, 1, 6),
        accessibilityLevel: "Applied",
        purpose: "reflect",
        screenTitle: `Return ${corpusItem.title} to the museum module`,
        content: "Learners reflect on how the source-backed concept supports mastery of the parent module.",
        activityPrompt: `How does ${corpusItem.title} help a visitor understand the parent concept more fully?`
      }
    ];
    const challengePath = [
      {
        dokLevel: clamp(getCognitiveIdFromSetting((mapDokTargetsToCognitiveTargets(corpusItem.dokTargets).at(-1)), 5), 1, 6),
        accessibilityLevel: corpusItem.accessibilityTargets[corpusItem.accessibilityTargets.length - 1] ?? "Referential",
        purpose: "extend",
        screenTitle: `Challenge: synthesize ${corpusItem.title}`,
        content: `Learners use ${corpusItem.title} for ${corpusItem.learningUses.join(", ")}.`,
        activityPrompt: corpusItem.suggestedPrompts[2] ?? corpusItem.suggestedPrompts[0]
      },
      {
        dokLevel: 5,
        accessibilityLevel: "Archival",
        purpose: "apply",
        screenTitle: `Build a source-backed museum prompt`,
        content: "Learners turn corpus evidence into a visitor-facing interpretive task.",
        activityPrompt: `Create a museum activity that cites or names at least one source for ${corpusItem.title}.`
      },
      {
        dokLevel: 6,
        accessibilityLevel: "Applied",
        purpose: "reflect",
        screenTitle: `Defend the learning design`,
        content: "Learners explain why the selected source base supports the module's mastery goal.",
        activityPrompt: `What makes ${corpusItem.title} useful evidence for this curriculum design?`
      }
    ];
    const learningPath = learnerChoice === "challenge" ? challengePath : supportPath;
    const screens = learningPath.map((pathNode, index) => makeAdaptiveScreen(parentScreen, pathNode, index, designerSettings));
    return {
      id: `${parentScreen.id}-${learnerChoice}-corpus-mastery-path`,
      parentModuleId: "knowledge-corpus",
      parentScreenId: parentScreen.id,
      targetConcept: corpusItem.title,
      title: `${corpusItem.title} Corpus Mastery Path`,
      creationMode: designerSettings.subModuleCreationMode,
      designerPreferredZone: {
        cognitiveLevel: mapDokTargetsToCognitiveTargets(corpusItem.dokTargets).join(", "),
        accessibilityLevel: corpusItem.accessibilityTargets.join(", "),
        pathStyle: designerSettings.adaptivePathStyle,
        threshold: designerSettings.masteryThreshold
      },
      screens: assignHalftonePrompts(screens, designerSettings.halftonePromptPercent),
      learningPath,
      rationale:
        learnerChoice === "challenge"
          ? "This corpus-backed challenge path raises cognitive depth by asking the learner to synthesize source-grounded evidence into museum interpretation."
          : "This corpus-backed support path increases scaffolding with source summaries and suggested prompts before returning to the parent module."
    };
  }

  const parentDok = clamp(parentScreen.cognitiveDepthLevel ?? parentScreen.dokLevel, 1, 6);
  const parentLocus = getLearningLocusFromComponent(parentScreen);
  const remediationPriority =
    parentLocus.key === "worth-being-familiar-with"
      ? "This path briefly checks familiarity, but prioritizes mastery support for the more central concepts this context supports."
      : `This path prioritizes ${parentLocus.label} because it is important for transfer, progression, or later mastery loops.`;
  const parentAccessIndex = getAccessIndex(parentScreen.accessibilityLevel);
  const targetDok = clamp(getDokFromSetting(designerSettings.preferredDokTarget, parentDok), 1, 6);
  const allowedLow = getCognitiveIdFromSetting(designerSettings.allowedCognitiveLow, 1);
  const allowedHigh = getCognitiveIdFromSetting(designerSettings.allowedCognitiveHigh, 6);
  const clampCognitivePath = (level) => clamp(level, Math.min(allowedLow, allowedHigh), Math.max(allowedLow, allowedHigh));
  const targetAccess =
    designerSettings.preferredAccessibilityTarget === "adaptive"
      ? parentScreen.accessibilityLevel
      : designerSettings.preferredAccessibilityTarget;
  const targetAccessIndex = getAccessIndex(targetAccess);

  const needsSupport = learnerChoice === "needs_support";
  const baseAccessIndex = needsSupport ? Math.max(0, parentAccessIndex - 1) : Math.min(accessibilityLevels.length - 1, parentAccessIndex + 1);
  const movementLimited = designerSettings.cognitiveMovement === "Limited movement only";
  const sequenceMostlyUpward = designerSettings.cognitiveMovement === "No, keep sequence mostly upward";
  const supportFloor = sequenceMostlyUpward ? Math.max(allowedLow, parentDok - 1) : movementLimited ? Math.max(allowedLow, parentDok - 2) : allowedLow;
  const reviewDok = clamp(Math.min(parentDok, targetDok) - 1, supportFloor, allowedHigh);
  const challengeDok = clamp(Math.max(parentDok, targetDok) + 1, allowedLow, allowedHigh);

  const learningPath = needsSupport
    ? [
        {
          dokLevel: reviewDok,
          accessibilityLevel: accessibilityLevels[Math.max(0, baseAccessIndex - 1)],
          purpose: "review",
          screenTitle: `What is the core idea behind ${parentScreen.concept}?`
        },
        {
          dokLevel: clampCognitivePath(Math.min(parentDok, targetDok)),
          accessibilityLevel: accessibilityLevels[Math.max(0, baseAccessIndex - 1)],
          purpose: "scaffold",
          screenTitle: `How did ${parentScreen.concept} respond to community needs?`
        },
        {
          dokLevel: clampCognitivePath(parentDok),
          accessibilityLevel: accessibilityLevels[clamp(targetAccessIndex, 0, accessibilityLevels.length - 1)],
          purpose: "practice",
          screenTitle: `Use evidence to explain ${parentScreen.concept}`
        },
        {
          dokLevel: clampCognitivePath(Math.max(parentDok, targetDok)),
          accessibilityLevel: accessibilityLevels[clamp(targetAccessIndex, 0, accessibilityLevels.length - 1)],
          purpose: "apply",
          screenTitle: `Apply ${parentScreen.concept} to a museum visitor question`
        },
        {
          dokLevel: clampCognitivePath(Math.max(parentDok, targetDok, 6)),
          accessibilityLevel: "Referential",
          purpose: "reflect",
          screenTitle: `What does ${parentScreen.concept} help us understand today?`
        }
      ]
    : [
        {
          dokLevel: challengeDok,
          accessibilityLevel: accessibilityLevels[clamp(parentAccessIndex + 1, 0, accessibilityLevels.length - 1)],
          purpose: "extend",
          screenTitle: `Challenge: interpret ${parentScreen.concept} across sources`
        },
        {
          dokLevel: challengeDok,
          accessibilityLevel: accessibilityLevels[clamp(Math.max(parentAccessIndex + 1, targetAccessIndex), 0, accessibilityLevels.length - 1)],
          purpose: "apply",
          screenTitle: `Transfer ${parentScreen.concept} into a new civic-learning design`
        },
        {
          dokLevel: clampCognitivePath(Math.max(challengeDok, 6)),
          accessibilityLevel: "Archival",
          purpose: "reflect",
          screenTitle: `Defend an interpretation of ${parentScreen.concept}`
        }
      ];

  const screens = learningPath.map((pathNode, index) => makeAdaptiveScreen(parentScreen, pathNode, index, designerSettings));

  return {
    id: `${parentScreen.id}-${learnerChoice}-mastery-path`,
    parentModuleId: `phase-${parentScreen.id.split("-")[1] ?? "local"}`,
    parentScreenId: parentScreen.id,
    targetConcept: parentScreen.concept,
    title: `${parentScreen.concept} Mastery Sub-Module`,
    creationMode: designerSettings.subModuleCreationMode,
    designerPreferredZone: {
      cognitiveLevel: designerSettings.preferredDokTarget,
      accessibilityLevel: designerSettings.preferredAccessibilityTarget,
      pathStyle: designerSettings.adaptivePathStyle,
      threshold: designerSettings.masteryThreshold
    },
    screens: assignHalftonePrompts(screens, designerSettings.halftonePromptPercent),
    learningPath,
    rationale: needsSupport
      ? `${remediationPriority} This path temporarily moves the learner from ${getCognitiveLabel(parentDok)} back toward ${getCognitiveLabel(reviewDok)} and ${getCognitiveLabel(Math.min(parentDok, targetDok))}, then returns to the target level through a scaffolded transfer task.`
      : `This path moves the learner from ${getCognitiveLabel(parentDok)} toward ${getCognitiveLabel(challengeDok)} and ${getCognitiveLabel(6)}, reducing scaffolding and inviting transfer or reflective mastery.`
  };
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <select className="field-control" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => {
          const optionValue = typeof option === "string" ? option : option.value;
          const optionLabel = typeof option === "string" ? option : option.label;
          return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
          );
        })}
      </select>
    </label>
  );
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="checkbox-field">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function AccordionSection({ id, title, icon, open, onToggle, children }) {
  return (
    <section className={`accordion-section${open ? " open" : ""}`}>
      <button className="accordion-trigger" type="button" onClick={() => onToggle(id)} aria-expanded={open}>
        <span>
          {icon}
          {title}
        </span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open ? <div className="accordion-content">{children}</div> : null}
    </section>
  );
}

function DesignerMasterySettings({ settings, onChange }) {
  function update(key, value) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <div className="mastery-settings">
      <div className="section-label">
        <Brain size={17} /> Designer Mastery Settings
      </div>
      <div className="form-stack compact">
        <CheckboxField label="Enable mastery learning" checked={settings.enabled} onChange={(value) => update("enabled", value)} />
        <SelectField
          label="Default mastery threshold"
          value={settings.masteryThreshold}
          onChange={(value) => update("masteryThreshold", value)}
          options={masteryThresholds}
        />
        <div className="two-column-fields">
          <SelectField
            label="Cognitive target"
            value={settings.preferredDokTarget}
            onChange={(value) => update("preferredDokTarget", value)}
            options={masteryCognitiveTargets}
          />
          <SelectField
            label="Access target"
            value={settings.preferredAccessibilityTarget}
            onChange={(value) => update("preferredAccessibilityTarget", value)}
            options={["adaptive", ...accessibilityLevels]}
          />
          <SelectField
            label="Allowed low"
            value={settings.allowedCognitiveLow}
            onChange={(value) => update("allowedCognitiveLow", value)}
            options={cognitiveLevelOptions}
          />
          <SelectField
            label="Allowed high"
            value={settings.allowedCognitiveHigh}
            onChange={(value) => update("allowedCognitiveHigh", value)}
            options={cognitiveLevelOptions}
          />
        </div>
        <SelectField
          label="Adaptive path style"
          value={settings.adaptivePathStyle}
          onChange={(value) => update("adaptivePathStyle", value)}
          options={adaptivePathStyles}
        />
        <SelectField
          label="Sub-module creation mode"
          value={settings.subModuleCreationMode}
          onChange={(value) => update("subModuleCreationMode", value)}
          options={subModuleCreationModes}
        />
        {settings.subModuleCreationMode === "Custom-design sub-module" ? (
          <div className="custom-submodule-fields">
            <label className="field-label">
              <span>Sub-module title</span>
              <input
                className="field-control"
                value={settings.customSubModuleTitle}
                onChange={(event) => update("customSubModuleTitle", event.target.value)}
              />
            </label>
            <label className="field-label">
              <span>Target concept</span>
              <input
                className="field-control"
                value={settings.customTargetConcept}
                onChange={(event) => update("customTargetConcept", event.target.value)}
              />
            </label>
            <label className="field-label">
              <span>Cognitive path</span>
              <input
                className="field-control"
                value={settings.customDokPath}
                onChange={(event) => update("customDokPath", event.target.value)}
                placeholder="Recognition, Application, Strategic Analysis"
              />
            </label>
            <label className="field-label">
              <span>Accessibility path</span>
              <input
                className="field-control"
                value={settings.customAccessibilityPath}
                onChange={(event) => update("customAccessibilityPath", event.target.value)}
                placeholder="Guided, Specific, Applied"
              />
            </label>
            <label className="field-label">
              <span>Screen prompts</span>
              <textarea
                className="field-control textarea small-textarea"
                value={settings.customScreenPrompts}
                onChange={(event) => update("customScreenPrompts", event.target.value)}
                placeholder="Review..., Practice..., Apply..."
              />
            </label>
          </div>
        ) : null}
        <SelectField
          label="Allow back-and-forth cognitive movement"
          value={settings.cognitiveMovement}
          onChange={(value) => update("cognitiveMovement", value)}
          options={movementOptions}
        />
        <div className="theory-mapping-list">
          {cognitiveDepthLevels.map((level) => (
            <div key={level.key}>
              <strong>{level.label}</strong>
              <span>{level.description}</span>
              <small>
                {level.dokMapping} | Bloom: {level.bloomMapping}
              </small>
            </div>
          ))}
        </div>
        <label className="field-label">
          <span>Use halftone image prompts on {settings.halftonePromptPercent}% of slides</span>
          <input
            className="field-control"
            type="number"
            min="0"
            max="100"
            step="5"
            value={settings.halftonePromptPercent}
            onChange={(event) => update("halftonePromptPercent", Number(event.target.value))}
          />
        </label>
        <CheckboxField
          label="Include partner-learning prompts"
          checked={settings.includePartnerPrompts}
          onChange={(value) => update("includePartnerPrompts", value)}
        />
      </div>
    </div>
  );
}

function SampleConceptPanel({ onLoadSample }) {
  return (
    <div className="sample-concepts">
      <div className="section-label">
        <Sparkles size={17} /> Museum Sample Concepts
      </div>
      <div className="sample-stack">
        {sampleConcepts.map((sample) => (
          <button className="sample-button" key={sample.id} onClick={() => onLoadSample(sample)}>
            <span>{sample.title}</span>
            <small>
              {sample.dokTarget.split("-").map((level) => getCognitiveLabel(Number(level))).join(" to ")} | {sample.accessibility}
            </small>
            <em>{sample.theme}</em>
          </button>
        ))}
      </div>
    </div>
  );
}

function LearningLocusSettings({ settings, onChange, selectedNode }) {
  function update(key, value) {
    onChange({ ...settings, [key]: value });
  }
  const locus = selectedNode ? getLearningLocusFromComponent(selectedNode) : learningLocusLevels[1];

  return (
    <div className="learning-locus-settings">
      <div className="section-label">
        <Target size={17} /> Learning-Locus Settings
      </div>
      <SelectField
        label="Weighting preference"
        value={settings.weightingPreference}
        onChange={(value) => update("weightingPreference", value)}
        options={learningLocusWeightingOptions}
      />
      <SelectField
        label="Selected component locus"
        value={settings.selectedOverride}
        onChange={(value) => update("selectedOverride", value)}
        options={learningLocusOptions}
      />
      <div className="locus-current-note">
        <strong>{locus.label}</strong>
        <span>{selectedNode?.learningLocusRationale ?? locus.description}</span>
      </div>
    </div>
  );
}

function SlideStepper({ slideCount, selectedSlideIndex, onSelectSlide, slideSettingsByKey, selectedNode }) {
  return (
    <div className="slide-stepper" aria-label="Learning slide list">
      {Array.from({ length: slideCount }, (_, index) => {
        const settings = getSlideSettings(slideSettingsByKey, selectedNode, index);
        return (
          <button
            type="button"
            className={`slide-step${index === selectedSlideIndex ? " active" : ""}`}
            key={index}
            onClick={() => onSelectSlide(index)}
          >
            <span>Slide {index + 1}</span>
            <small>{slideTypeLabels[settings.slideType]}</small>
          </button>
        );
      })}
    </div>
  );
}

function SlideSettingsPanel({
  selectedNode,
  selectedSlideIndex,
  slideCountSetting,
  slideSettings,
  dynamicGenerationEnabled,
  visualSettings,
  currentVisual,
  onDynamicGenerationChange,
  onVisualSettingsChange,
  onSlideCountChange,
  onSelectedSlideChange,
  onSlideSettingsChange
}) {
  function updateSlideSetting(path, value) {
    const [section, key] = path;
    if (key) {
      onSlideSettingsChange({
        ...slideSettings,
        [section]: {
          ...slideSettings[section],
          [key]: value
        }
      });
      return;
    }
    onSlideSettingsChange({ ...slideSettings, [section]: value });
  }

  function updateChoice(index, value) {
    const choices = [...slideSettings.multipleChoice.choices];
    choices[index] = value;
    updateSlideSetting(["multipleChoice", "choices"], choices);
  }

  function updateChoiceCount(nextCount) {
    const count = clamp(Number(nextCount) || 3, 3, 5);
    const currentChoices = slideSettings.multipleChoice.choices;
    const choices = Array.from({ length: count }, (_, index) => currentChoices[index] ?? `Choice ${index + 1}`);
    onSlideSettingsChange({
      ...slideSettings,
      multipleChoice: {
        ...slideSettings.multipleChoice,
        choices,
        correctIndex: clamp(slideSettings.multipleChoice.correctIndex, 0, count - 1)
      }
    });
  }

  return (
    <div className="slide-settings">
      <div className="section-label">
        <BookOpen size={17} /> Slide Settings
      </div>
      <div className="form-stack compact">
        <div className="dynamic-generation-control">
          <CheckboxField
            label={`Dynamic generation: ${dynamicGenerationEnabled ? "On" : "Off"}`}
            checked={dynamicGenerationEnabled}
            onChange={onDynamicGenerationChange}
          />
          <p>Dynamic generation currently uses local template logic; future version can connect to AI image/text generation.</p>
        </div>
        <div className="two-column-fields">
          <SelectField
            label="Slides per phase"
            value={slideCountSetting.mode}
            onChange={(value) => onSlideCountChange({ ...slideCountSetting, mode: value })}
            options={slideCountOptions}
          />
          {slideCountSetting.mode === "Custom" ? (
            <label className="field-label">
              <span>Custom slide count</span>
              <input
                className="field-control"
                type="number"
                min="1"
                max="12"
                value={slideCountSetting.customCount}
                onChange={(event) => onSlideCountChange({ ...slideCountSetting, customCount: Number(event.target.value) })}
              />
            </label>
          ) : null}
        </div>
        <SlideStepper
          slideCount={normalizeSlideCountSetting(slideCountSetting)}
          selectedSlideIndex={selectedSlideIndex}
          onSelectSlide={onSelectedSlideChange}
          slideSettingsByKey={{ [getSlideKey(selectedNode.id, selectedSlideIndex)]: slideSettings }}
          selectedNode={selectedNode}
        />
        <SelectField
          label={`Slide ${selectedSlideIndex + 1} type`}
          value={slideSettings.slideType}
          onChange={(value) => updateSlideSetting(["slideType"], value)}
          options={slideTypes}
        />
        <SlideTypeEditor
          settings={slideSettings}
          onUpdate={updateSlideSetting}
          onUpdateChoice={updateChoice}
          onUpdateChoiceCount={updateChoiceCount}
        />
        {!dynamicGenerationEnabled ? (
          <ManualSlideContentEditor
            manualContent={slideSettings.manualContent ?? makeDefaultSlideSettings(selectedNode, selectedSlideIndex).manualContent}
            onChange={(manualContent) => onSlideSettingsChange({ ...slideSettings, manualContent })}
          />
        ) : null}
        <LearnerVisualSettings settings={visualSettings} currentVisual={currentVisual} onChange={onVisualSettingsChange} />
      </div>
    </div>
  );
}

function LearnerVisualSettings({ settings, currentVisual, onChange }) {
  function update(key, value) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <div className="learner-visual-settings">
      <div className="section-label">
        <Info size={16} /> Learner Visuals
      </div>
      <CheckboxField
        label={`Auto-populate learner slide visuals: ${settings.autoPopulate ? "On" : "Off"}`}
        checked={settings.autoPopulate}
        onChange={(value) => update("autoPopulate", value)}
      />
      <SelectField
        label="Learner visual style"
        value={settings.visualStyle}
        onChange={(value) => update("visualStyle", value)}
        options={learnerVisualStyleOptions}
      />
      <SelectField
        label="Selected image"
        value={settings.selectedImageId}
        onChange={(value) => update("selectedImageId", value)}
        options={[
          { value: "auto", label: "Auto-select" },
          { value: "text-only", label: "No image / text only" },
          ...museumImages.map((image) => ({ value: image.id, label: image.title }))
        ]}
      />
      <label className="field-label">
        <span>Optional caption</span>
        <input
          className="field-control"
          value={settings.caption}
          onChange={(event) => update("caption", event.target.value)}
          placeholder="Use selected image title when blank"
        />
      </label>
      <label className="field-label">
        <span>Optional image prompt</span>
        <textarea
          className="field-control textarea small-textarea"
          value={settings.imagePrompt}
          onChange={(event) => update("imagePrompt", event.target.value)}
          placeholder="Use generated image prompt when blank"
        />
      </label>
      <div className="visual-source-debug">
        Current visual source: {currentVisual?.sourceLabel ?? "Fallback generated visual"}
      </div>
    </div>
  );
}

function ManualSlideContentEditor({ manualContent, onChange }) {
  function update(key, value) {
    onChange({ ...manualContent, [key]: value });
  }

  return (
    <div className="manual-slide-editor">
      <div className="section-label">
        <Clipboard size={16} /> Static Slide Text
      </div>
      <label className="field-label">
        <span>Manual title</span>
        <input className="field-control" value={manualContent.title} onChange={(event) => update("title", event.target.value)} placeholder="Use stored title when blank" />
      </label>
      <label className="field-label">
        <span>Manual explanation</span>
        <textarea className="field-control textarea small-textarea" value={manualContent.concept} onChange={(event) => update("concept", event.target.value)} placeholder="Use stored explanation when blank" />
      </label>
      <label className="field-label">
        <span>Manual why it matters</span>
        <textarea className="field-control textarea small-textarea" value={manualContent.why} onChange={(event) => update("why", event.target.value)} placeholder="Use stored rationale when blank" />
      </label>
      <label className="field-label">
        <span>Manual learner task</span>
        <textarea className="field-control textarea small-textarea" value={manualContent.task} onChange={(event) => update("task", event.target.value)} placeholder="Use stored task when blank" />
      </label>
      <label className="field-label">
        <span>Manual deeper prompts, one per line</span>
        <textarea className="field-control textarea small-textarea" value={manualContent.deeper} onChange={(event) => update("deeper", event.target.value)} placeholder="Use stored deeper prompts when blank" />
      </label>
      <label className="field-label">
        <span>Manual image prompt</span>
        <textarea className="field-control textarea small-textarea" value={manualContent.imagePrompt} onChange={(event) => update("imagePrompt", event.target.value)} placeholder="Use stored image prompt when blank" />
      </label>
    </div>
  );
}

function SlideTypeEditor({ settings, onUpdate, onUpdateChoice, onUpdateChoiceCount }) {
  if (settings.slideType === "content") {
    return <p className="settings-hint">Content slides use the generated concept, why-it-matters text, quick task, and deeper-learning prompts.</p>;
  }

  if (settings.slideType === "multiple_choice") {
    return (
      <div className="interactive-editor">
        <SelectField
          label="Number of choices"
          value={String(settings.multipleChoice.choices.length)}
          onChange={onUpdateChoiceCount}
          options={["3", "4", "5"]}
        />
        {settings.multipleChoice.choices.map((choice, index) => (
          <label className="field-label" key={index}>
            <span>Choice {index + 1}</span>
            <input className="field-control" value={choice} onChange={(event) => onUpdateChoice(index, event.target.value)} />
          </label>
        ))}
        <SelectField
          label="Correct answer"
          value={String(settings.multipleChoice.correctIndex)}
          onChange={(value) => onUpdate(["multipleChoice", "correctIndex"], Number(value))}
          options={settings.multipleChoice.choices.map((_, index) => String(index))}
        />
        <label className="field-label">
          <span>Feedback text</span>
          <textarea className="field-control textarea small-textarea" value={settings.multipleChoice.feedback} onChange={(event) => onUpdate(["multipleChoice", "feedback"], event.target.value)} />
        </label>
      </div>
    );
  }

  if (settings.slideType === "true_false") {
    return (
      <div className="interactive-editor">
        <SelectField
          label="Correct answer"
          value={settings.trueFalse.correctAnswer}
          onChange={(value) => onUpdate(["trueFalse", "correctAnswer"], value)}
          options={["true", "false"]}
        />
        <label className="field-label">
          <span>Feedback text</span>
          <textarea className="field-control textarea small-textarea" value={settings.trueFalse.feedback} onChange={(event) => onUpdate(["trueFalse", "feedback"], event.target.value)} />
        </label>
      </div>
    );
  }

  if (settings.slideType === "fill_blank") {
    return (
      <div className="interactive-editor">
        <label className="field-label">
          <span>Blank prompt</span>
          <textarea className="field-control textarea small-textarea" value={settings.fillBlank.prompt} onChange={(event) => onUpdate(["fillBlank", "prompt"], event.target.value)} />
        </label>
        <label className="field-label">
          <span>Expected answer / keywords</span>
          <input className="field-control" value={settings.fillBlank.expectedAnswer} onChange={(event) => onUpdate(["fillBlank", "expectedAnswer"], event.target.value)} />
        </label>
      </div>
    );
  }

  if (settings.slideType === "short_essay") {
    return (
      <div className="interactive-editor">
        <label className="field-label">
          <span>Prompt</span>
          <textarea className="field-control textarea small-textarea" value={settings.shortEssay.prompt} onChange={(event) => onUpdate(["shortEssay", "prompt"], event.target.value)} />
        </label>
        <label className="field-label">
          <span>Suggested evaluation criteria</span>
          <textarea className="field-control textarea small-textarea" value={settings.shortEssay.criteria} onChange={(event) => onUpdate(["shortEssay", "criteria"], event.target.value)} />
        </label>
      </div>
    );
  }

  const section = settings.slideType === "discussion" ? "discussion" : "reflection";
  return (
    <div className="interactive-editor">
      <label className="field-label">
        <span>Prompt</span>
        <textarea className="field-control textarea small-textarea" value={settings[section].prompt} onChange={(event) => onUpdate([section, "prompt"], event.target.value)} />
      </label>
      <label className="field-label">
        <span>Optional partner-learning prompt</span>
        <textarea className="field-control textarea small-textarea" value={settings[section].partnerPrompt} onChange={(event) => onUpdate([section, "partnerPrompt"], event.target.value)} />
      </label>
    </div>
  );
}

function KnowledgeCorpusPanel({
  corpusQuery,
  onCorpusQueryChange,
  recommendedItems,
  searchResults,
  selectedCorpusItems,
  onUseInModule,
  onGenerateMasteryPath
}) {
  const selectedIds = new Set(selectedCorpusItems.map((item) => item.id));

  function CorpusItemCard({ item, compact = false }) {
    return (
      <article className={`corpus-card${compact ? " compact" : ""}`}>
        <div>
          <h4>{item.title}</h4>
          <span>{item.category}</span>
        </div>
        <p>{item.summary}</p>
        <div className="corpus-theory-line">
          {(item.cognitiveTargets ?? mapDokTargetsToCognitiveTargets(item.dokTargets)).join(" / ")}
        </div>
        <div className="chip-row tight">
          {item.learningUses.slice(0, compact ? 2 : 4).map((use) => (
            <span className="chip" key={use}>
              {use}
            </span>
          ))}
        </div>
        <div className="source-list compact">
          {item.sources.slice(0, compact ? 1 : 3).map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
              {source.label}
            </a>
          ))}
        </div>
        <div className="corpus-actions">
          <button className="secondary-button" onClick={() => onUseInModule(item)}>
            {selectedIds.has(item.id) ? "Added" : "Use in Module"}
          </button>
          <button className="secondary-button" onClick={() => onGenerateMasteryPath(item)}>
            Generate Mastery Path from This
          </button>
        </div>
      </article>
    );
  }

  return (
    <div className="knowledge-corpus">
      <div className="section-label">
        <BookOpen size={17} /> Sources / Knowledge Base
      </div>
      <label className="field-label">
        <span>Search corpus</span>
        <input
          className="field-control"
          value={corpusQuery}
          onChange={(event) => onCorpusQueryChange(event.target.value)}
          placeholder="Search theme, source, prompt, or learning use"
        />
      </label>
      {selectedCorpusItems.length ? (
        <div className="selected-corpus-strip">
          {selectedCorpusItems.map((item) => (
            <span key={item.id}>{item.title}</span>
          ))}
        </div>
      ) : null}
      <div className="corpus-subheading">Recommended for this theme</div>
      <div className="corpus-stack recommended">
        {recommendedItems.map((item) => (
          <CorpusItemCard item={item} compact key={item.id} />
        ))}
      </div>
      <div className="corpus-subheading">Browse corpus</div>
      <div className="corpus-stack">
        {searchResults.map((item) => (
          <CorpusItemCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}

function MiniAxisMap({ path }) {
  const accessStep = 68 / (accessibilityLevels.length - 1);
  const getMiniY = (level) => 84 - (clamp(level, 1, 6) - 1) * 13;
  const plottedPath = path.map((node, index) => {
    const x = 20 + getAccessIndex(node.accessibilityLevel) * accessStep;
    const y = getMiniY(node.dokLevel);
    return {
      ...node,
      index,
      x,
      y
    };
  });
  const pathPoints = plottedPath.map((node) => `${node.x},${node.y}`).join(" ");

  return (
    <div className="mini-axis-frame">
      <div className="mini-axis-map" aria-label="Adaptive mastery path across cognitive depth and knowledge accessibility axes">
        <div className="mini-axis-dok-label">Cognitive Depth & Transfer</div>
        <div className="mini-axis-access-label">Knowledge accessibility / at one's fingertips</div>
        {[6, 5, 4, 3, 2, 1].map((level) => (
          <span key={level} className="mini-dok-tick" style={{ top: `${getMiniY(level)}%` }}>
            {getCognitiveShortLabel(level)}
          </span>
        ))}
        {accessibilityLevels.map((level, index) => (
          <span key={level} className="mini-access-tick" style={{ left: `${20 + index * accessStep}%` }}>
            {level}
          </span>
        ))}
        <svg className="mini-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id="mini-path-arrow" markerWidth="8" markerHeight="8" refX="6.8" refY="4" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L8,4 L0,8 Z" fill="#2a241e" />
            </marker>
          </defs>
          <polyline points={pathPoints} className="mini-path-line" markerEnd="url(#mini-path-arrow)" />
        </svg>
        {plottedPath.map((node) => (
          <div
            key={`${node.screenTitle}-${node.index}`}
            className={`mini-axis-node purpose-${node.purpose}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            title={`Screen ${node.index + 1}: ${getCognitiveLabel(node.dokLevel)} / ${node.accessibilityLevel} - ${node.screenTitle}`}
          >
            {node.index + 1}
          </div>
        ))}
      </div>
      <div className="mini-axis-caption">
        This mastery path temporarily increases scaffolding before returning the learner to the target concept.
      </div>
      <div className="mini-axis-legend">
        <span><i className="legend-dot review-dot" /> Review may move toward Recognition or Comprehension</span>
        <span><i className="legend-dot scaffold-dot" /> Scaffold moves toward accessible knowledge</span>
        <span><i className="legend-dot apply-dot" /> Apply or reflect moves toward transfer mastery</span>
      </div>
    </div>
  );
}

function AdaptiveSubModulePanel({ subModule }) {
  if (!subModule) return null;

  return (
    <section className="adaptive-panel">
      <div className="adaptive-heading">
        <div>
          <div className="section-label">
            <Sparkles size={16} /> Adaptive Sub-Module
          </div>
          <p className="adaptive-kicker">AI-Generated Mastery Path</p>
          <h4>{subModule.targetConcept}</h4>
        </div>
        <span className="chip">{subModule.screens.length} screens</span>
      </div>
      <p className="adaptive-rationale">{subModule.rationale}</p>
      <MiniAxisMap path={subModule.learningPath} />
      <div className="submodule-deck">
        {subModule.screens.map((screen, index) => (
          <article className="submodule-card" key={screen.id}>
            <div className="submodule-card-top">
              <span className="screen-number">{index + 1}</span>
              <div>
                <h5>{screen.title}</h5>
                <div className="chip-row tight">
                  <span className="chip">{getCognitiveLabel(screen.cognitiveDepthLevel ?? screen.dokLevel)}</span>
                  <span className="chip">{screen.accessibilityLevel}</span>
                  <span className="chip">{subModule.learningPath[index].purpose}</span>
                </div>
              </div>
            </div>
            <p>{screen.content}</p>
            <div className="micro-box">
              <strong>Activity</strong>
              <span>{screen.activityPrompt}</span>
            </div>
            {screen.partnerPrompt ? (
              <div className="micro-box partner">
                <strong>Partner prompt</strong>
                <span>{screen.partnerPrompt}</span>
              </div>
            ) : null}
            {screen.imagePrompt ? (
              <div className="micro-box image">
                <strong>Suggested Image Prompt</strong>
                <span>{screen.imagePrompt}</span>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function PathNavigator({ nodes, selectedNodeId, onSelectNode, hidden, dockPosition, onDockPositionChange, onHiddenChange }) {
  const accessStep = 100 / Math.max(accessibilityLevels.length - 1, 1);
  const getY = (level) => 100 - ((clamp(level, 1, 6) - 1) / 5) * 100;

  if (hidden) {
    return (
      <div className="path-navigator-hidden">
        <button type="button" className="secondary-button" onClick={() => onHiddenChange(false)}>
          Show Navigator
        </button>
      </div>
    );
  }

  return (
    <div className={`path-navigator dock-${dockPosition.replace(" ", "-")}`} aria-label="Path Navigator">
      <div className="path-navigator-toolbar">
        <div className="path-navigator-title">Path Navigator</div>
        <button type="button" className="navigator-hide-button" onClick={() => onHiddenChange(true)}>
          Hide Navigator
        </button>
      </div>
      <SelectField label="Dock" value={dockPosition} onChange={onDockPositionChange} options={navigatorDockOptions} />
      <div className="path-navigator-field">
        {nodes.map((node, index) => {
          const locus = getLearningLocusFromComponent(node);
          const x = getAccessIndex(node.access) * accessStep;
          const y = getY(node.dok);
          return (
            <button
              key={node.id}
              type="button"
              className={`navigator-dot navigator-${locus.key}${node.id === selectedNodeId ? " active" : ""}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => onSelectNode(node.id)}
              title={`${index + 1}. ${node.title}`}
              aria-label={`Select ${node.title}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LearnerActivity({ slide }) {
  const [selectedAnswer, setSelectedAnswer] = React.useState("");
  const [textResponse, setTextResponse] = React.useState("");

  React.useEffect(() => {
    setSelectedAnswer("");
    setTextResponse("");
  }, [slide.title, slide.slideType]);

  if (slide.slideType === "content") return null;

  const settings = slide.interaction;
  if (slide.slideType === "multiple_choice") {
    const correctValue = String(settings.multipleChoice.correctIndex);
    const hasAnswered = selectedAnswer !== "";
    const isCorrect = selectedAnswer === correctValue;
    return (
      <section className="learner-activity">
        <h4>Activity: Multiple Choice</h4>
        <div className="answer-stack">
          {settings.multipleChoice.choices.map((choice, index) => (
            <button
              type="button"
              className={`answer-option${selectedAnswer === String(index) ? " selected" : ""}`}
              key={`${choice}-${index}`}
              onClick={() => setSelectedAnswer(String(index))}
            >
              {choice}
            </button>
          ))}
        </div>
        {hasAnswered ? (
          <div className={`feedback-box ${isCorrect ? "correct" : "incorrect"}`}>
            {isCorrect ? "Correct. " : "Try again. "}
            {settings.multipleChoice.feedback}
          </div>
        ) : null}
      </section>
    );
  }

  if (slide.slideType === "true_false") {
    const hasAnswered = selectedAnswer !== "";
    const isCorrect = selectedAnswer === settings.trueFalse.correctAnswer;
    return (
      <section className="learner-activity">
        <h4>Activity: True / False</h4>
        <p>{slide.concept}</p>
        <div className="button-grid compact-buttons">
          {["true", "false"].map((answer) => (
            <button
              type="button"
              className={`answer-option${selectedAnswer === answer ? " selected" : ""}`}
              key={answer}
              onClick={() => setSelectedAnswer(answer)}
            >
              {answer === "true" ? "True" : "False"}
            </button>
          ))}
        </div>
        {hasAnswered ? (
          <div className={`feedback-box ${isCorrect ? "correct" : "incorrect"}`}>
            {isCorrect ? "Correct. " : "Not quite. "}
            {settings.trueFalse.feedback}
          </div>
        ) : null}
      </section>
    );
  }

  if (slide.slideType === "fill_blank") {
    return (
      <section className="learner-activity">
        <h4>Activity: Fill in the Blank</h4>
        <p>{settings.fillBlank.prompt}</p>
        <input className="field-control" value={textResponse} onChange={(event) => setTextResponse(event.target.value)} placeholder="Type your response" />
        {textResponse ? <div className="feedback-box">Expected keywords: {settings.fillBlank.expectedAnswer}</div> : null}
      </section>
    );
  }

  if (slide.slideType === "short_essay") {
    return (
      <section className="learner-activity">
        <h4>Activity: Short Essay</h4>
        <p>{settings.shortEssay.prompt}</p>
        <textarea className="field-control textarea" value={textResponse} onChange={(event) => setTextResponse(event.target.value)} placeholder="Draft a short response" />
        <div className="criteria-box">
          <strong>Suggested criteria</strong>
          <span>{settings.shortEssay.criteria}</span>
        </div>
      </section>
    );
  }

  const section = slide.slideType === "discussion" ? settings.discussion : settings.reflection;
  return (
    <section className="learner-activity">
      <h4>Activity: {slideTypeLabels[slide.slideType]}</h4>
      <p>{section.prompt}</p>
      <textarea className="field-control textarea small-textarea" value={textResponse} onChange={(event) => setTextResponse(event.target.value)} placeholder="Capture notes locally" />
      {section.partnerPrompt ? (
        <div className="micro-box partner">
          <strong>Partner guidance</strong>
          <span>{section.partnerPrompt}</span>
        </div>
      ) : null}
    </section>
  );
}

function LearnerViewToggle({ learnerView, onChange }) {
  return (
    <div className="learner-view-toggle" aria-label="Learner View">
      <span>Learner View</span>
      <div>
        <button type="button" className={learnerView === "course" ? "active" : ""} onClick={() => onChange("course")}>
          Course View
        </button>
        <button type="button" className={learnerView === "map" ? "active" : ""} onClick={() => onChange("map")}>
          Map View
        </button>
      </div>
    </div>
  );
}

function GeneratedVisualPlaceholder({ slide, visual }) {
  return (
    <div className="generated-visual-placeholder">
      <div className="generated-poster-mark">BPP Museum Learning</div>
      <div className="generated-visual-main">
        <span>Generated Visual Placeholder</span>
        <h3>{visual.caption || slide.title}</h3>
        <p>
          This area is reserved for a classroom-safe, historically respectful image connected to this slide's Black Panther Party Museum learning topic.
        </p>
      </div>
      <div className="generated-prompt-preview">
        <strong>Image prompt preview</strong>
        <span>{visual.imagePrompt}</span>
      </div>
    </div>
  );
}

function CourseVisual({ slide, selectedNode, visual }) {
  const [failedImageSrc, setFailedImageSrc] = React.useState("");
  React.useEffect(() => {
    setFailedImageSrc("");
  }, [visual.image?.src]);
  const imageAvailable = !!visual.image && failedImageSrc !== visual.image.src;
  const showGeneratedPlaceholder = visual.style === "Generated placeholder" || !imageAvailable;

  if (visual.style === "Text only") {
    return (
      <div className="course-visual text-only">
        <GeneratedVisualPlaceholder slide={slide} visual={visual} />
        <div className="course-visual-text-panel">
          <span>{slideTypeLabels[slide.slideType]}</span>
          <h3>{slide.title}</h3>
          <p>{slide.task}</p>
        </div>
      </div>
    );
  }

  if (showGeneratedPlaceholder) {
    return (
      <div className="course-visual generated-placeholder-mode">
        <GeneratedVisualPlaceholder slide={slide} visual={visual} />
        <div className="course-visual-text-panel">
          <span>{visual.caption}</span>
          <h3>{slide.title}</h3>
          <p>{slide.concept}</p>
        </div>
      </div>
    );
  }

  if (visual.style === "Image beside text") {
    return (
      <div className="course-visual image-beside-text">
        <div className="course-image-frame" aria-label={visual.image.title}>
          <img className="course-image-img" src={visual.image.src} alt={visual.image.title} onError={() => setFailedImageSrc(visual.image.src)} />
          <div className="course-image-caption-chip">{visual.image.title}</div>
        </div>
        <div className="course-visual-text-panel">
          <span>{visual.caption}</span>
          <h3>{slide.title}</h3>
          <p>{slide.concept}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-visual actual-image-overlay">
      <img className="course-image-img" src={visual.image.src} alt={visual.image.title} onError={() => setFailedImageSrc(visual.image.src)} />
      <div className="course-visual-text-panel">
        <span>{visual.caption}</span>
        <h3>{slide.title}</h3>
        <p>{slide.concept}</p>
      </div>
      <div className="course-visual-prompt">{visual.imagePrompt}</div>
    </div>
  );
}

function CourseView({
  learnerView,
  onLearnerViewChange,
  selectedNode,
  slide,
  selectedSlideIndex,
  selectedSlideCount,
  onSelectSlide,
  onBack,
  onNext,
  masterySettings,
  mode,
  learningScreen,
  checkpoint,
  subModule,
  onMasteryChoice,
  visual
}) {
  return (
    <section className="course-view-shell">
      <div className="course-view-topbar">
        <LearnerViewToggle learnerView={learnerView} onChange={onLearnerViewChange} />
        <div className="course-progress-meta">
          <span>Phase {selectedNode.phase}</span>
          <span>Slide {selectedSlideIndex + 1} of {selectedSlideCount}</span>
          <span>{getCognitiveLabel(selectedNode.dok)}</span>
          <span>{getLearningLocusFromComponent(selectedNode).label}</span>
        </div>
      </div>

      <article className="course-card">
        <div className="course-card-header">
          <div>
            <div className="course-kicker">{slideTypeLabels[slide.slideType]} activity</div>
            <h2>{slide.title}</h2>
          </div>
          <span className="status-badge status-in_progress">{selectedNode.access}</span>
        </div>

        <SlideStepper
          slideCount={selectedSlideCount}
          selectedSlideIndex={selectedSlideIndex}
          onSelectSlide={onSelectSlide}
          slideSettingsByKey={{ [getSlideKey(selectedNode.id, selectedSlideIndex)]: slide.interaction }}
          selectedNode={selectedNode}
        />

        <CourseVisual slide={slide} selectedNode={selectedNode} visual={visual} />

        <div className="course-content">
          <section>
            <h3>Learn</h3>
            <p>{slide.concept}</p>
          </section>
          <section>
            <h3>Why it matters</h3>
            <p>{slide.why}</p>
          </section>
          <section>
            <h3>Try it</h3>
            <p>{slide.task}</p>
          </section>
          <section>
            <h3>Go deeper</h3>
            <ul>
              {slide.deeper.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <LearnerActivity slide={slide} />

        <div className="course-navigation">
          <button className="secondary-button" type="button" onClick={onBack}>
            <MoveLeft size={17} /> Back
          </button>
          <button className="primary-button" type="button" onClick={onNext}>
            Next <MoveRight size={17} />
          </button>
        </div>

        <MasteryLearningArea
          enabled={masterySettings.enabled}
          mode={mode}
          learningScreen={learningScreen}
          checkpoint={checkpoint}
          subModule={subModule}
          onChoice={onMasteryChoice}
        />
      </article>
    </section>
  );
}

function TelescopicProjection({ parentNode, subModule, expanded, onToggle }) {
  if (!subModule) return null;
  const previewPath = subModule.learningPath.slice(0, 5);
  function handleToggle(event) {
    event.stopPropagation();
    onToggle();
  }

  return (
    <div
      className={`telescopic-projection${expanded ? " expanded" : ""}`}
      onClick={handleToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleToggle(event);
      }}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
    >
      <span className="projection-stem" />
      <span className="projection-card">
        <span className="projection-label">Mastery Sub-Module</span>
        <strong>{subModule.title ?? subModule.targetConcept}</strong>
        <small>Branches from: {parentNode.title}</small>
        <span className="projection-mini-path">
          {previewPath.map((node, index) => (
            <i key={`${node.screenTitle}-${index}`} title={`${getCognitiveLabel(node.dokLevel)} / ${node.accessibilityLevel}`}>
              {index + 1}
            </i>
          ))}
        </span>
        <span className="projection-badges">
          <em>{subModule.creationMode ?? "Auto-create sub-module"}</em>
          <em>{previewPath.length} path points</em>
        </span>
        {expanded ? (
          <span className="projection-expanded">
            <span className="projection-rationale">
              This sub-module branches from the parent learning phase to support mastery before the learner returns to the main module.
            </span>
            <MiniAxisMap path={subModule.learningPath} />
            <span className="projection-screen-list">
              {subModule.screens.map((screen) => (
                <span key={screen.id}>
                  <b>{screen.title}</b>
                  <small>{getCognitiveLabel(screen.cognitiveDepthLevel ?? screen.dokLevel)} | {screen.accessibilityLevel} | {subModule.learningPath.find((node) => node.screenTitle === screen.title)?.purpose ?? "practice"}</small>
                </span>
              ))}
            </span>
          </span>
        ) : null}
      </span>
    </div>
  );
}

function MasteryLearningArea({ enabled, mode, learningScreen, checkpoint, subModule, onChoice }) {
  if (!enabled) {
    return (
      <section className={`mastery-area muted mode-${mode}`}>
        <div className="section-label">
          <Brain size={16} /> Mastery Learning
        </div>
        <p>Enable mastery learning in Designer Mastery Settings to add checkpoints and adaptive sub-modules.</p>
      </section>
    );
  }

  return (
    <section className={`mastery-area mode-${mode}`}>
      <div className="mastery-topline">
        <div className="section-label">
          <Brain size={16} /> Mastery Learning
        </div>
        <span className={`status-badge status-${learningScreen.status}`}>{masteryStatusLabels[learningScreen.status]}</span>
      </div>
      <div className="check-card">
        <h4>Check Understanding</h4>
        <p>{learningScreen.checkForUnderstandingPrompt}</p>
        <div className="criteria-box">
          <strong>Mastery criteria</strong>
          <span>{learningScreen.masteryCriteria}</span>
        </div>
      </div>
      {checkpoint ? (
        <div className="checkpoint-summary">
          <span>Confidence: {checkpoint.learnerConfidence}</span>
          <span>Response: {checkpoint.responseQuality}</span>
          <span>{checkpoint.mastered ? "Mastery reached" : "Adaptive support active"}</span>
        </div>
      ) : null}
      <div className="mastery-actions">
        <button className="secondary-button mastery-button" onClick={() => onChoice("mastered")}>
          <CheckCircle2 size={17} /> I get it
        </button>
        <button className="secondary-button mastery-button" onClick={() => onChoice("needs_support")}>
          <HelpCircle size={17} /> I need more help
        </button>
        <button className="secondary-button mastery-button" onClick={() => onChoice("challenge")}>
          <ArrowUpRight size={17} /> Challenge me
        </button>
      </div>
      <AdaptiveSubModulePanel subModule={subModule} />
    </section>
  );
}

function App() {
  const [mode, setMode] = React.useState("designer");
  const [showLearnerPreview, setShowLearnerPreview] = React.useState(false);
  const [isDesignerPanelCollapsed, setIsDesignerPanelCollapsed] = React.useState(false);
  const [isSlidePanelCollapsed, setIsSlidePanelCollapsed] = React.useState(false);
  const [isMapFocusMode, setIsMapFocusMode] = React.useState(false);
  const [paneWidths, setPaneWidths] = React.useState({ left: 360, right: 440 });
  const [form, setForm] = React.useState({
    audience: "General Public",
    theme: "Black Panther Party Free Breakfast Program",
    goal:
      "Help learners understand how community food programs combined direct service, political education, and community empowerment.",
    duration: "1 week",
    phase: 2,
    startDok: "Recognition",
    startAccess: "Basic",
    targetDok: "Strategic Analysis",
    targetAccess: "Referential"
  });
  const [nodes, setNodes] = React.useState(() => makeNodes({ ...form, phase: 2 }));
  const [selectedNodeId, setSelectedNodeId] = React.useState(nodes[0].id);
  const [variantIndex, setVariantIndex] = React.useState(0);
  const [masterySettings, setMasterySettings] = React.useState({
    enabled: true,
    masteryThreshold: "Strong understanding",
    preferredDokTarget: "adaptive",
    preferredAccessibilityTarget: "adaptive",
    adaptivePathStyle: "Balanced",
    subModuleCreationMode: "Auto-create sub-module",
    cognitiveMovement: "Yes, adaptive movement encouraged",
    allowedCognitiveLow: "Recognition",
    allowedCognitiveHigh: "Reflective Mastery",
    halftonePromptPercent: 20,
    customSubModuleTitle: "Custom Mastery Sub-Module",
    customTargetConcept: "Parent concept mastery",
    customDokPath: "Recognition, Application, Strategic Analysis",
    customAccessibilityPath: "Guided, Specific, Applied, Referential",
    customScreenPrompts: "Review the core idea, Practice with guided evidence, Apply the concept to a museum question, Reflect on meaning",
    includePartnerPrompts: true
  });
  const [screenStatuses, setScreenStatuses] = React.useState({});
  const [masteryCheckpoints, setMasteryCheckpoints] = React.useState({});
  const [adaptiveSubModules, setAdaptiveSubModules] = React.useState({});
  const [expandedProjectionIds, setExpandedProjectionIds] = React.useState({});
  const [corpusQuery, setCorpusQuery] = React.useState("");
  const [selectedCorpusItems, setSelectedCorpusItems] = React.useState([]);
  const [learningLocusSettings, setLearningLocusSettings] = React.useState({
    weightingPreference: "Balanced",
    selectedOverride: "Auto-evaluate"
  });
  const [phaseSlideSettings, setPhaseSlideSettings] = React.useState({
    1: { mode: "2", customCount: 2 },
    2: { mode: "3", customCount: 3 },
    3: { mode: "3", customCount: 3 },
    4: { mode: "4", customCount: 4 },
    5: { mode: "4", customCount: 4 },
    6: { mode: "5", customCount: 5 }
  });
  const [selectedSlideByNode, setSelectedSlideByNode] = React.useState({});
  const [slideSettingsByKey, setSlideSettingsByKey] = React.useState({});
  const [isNavigatorHidden, setIsNavigatorHidden] = React.useState(false);
  const [navigatorDockPosition, setNavigatorDockPosition] = React.useState("below map");
  const [dynamicGenerationEnabled, setDynamicGenerationEnabled] = React.useState(true);
  const [learnerVisualSettings, setLearnerVisualSettings] = React.useState({
    autoPopulate: true,
    visualStyle: "Actual image with overlay",
    selectedImageId: "auto",
    caption: "",
    imagePrompt: ""
  });
  const [learnerView, setLearnerView] = React.useState("course");
  const [openDesignerSections, setOpenDesignerSections] = React.useState({
    experience: true,
    axis: true,
    locus: false,
    mastery: false,
    slides: true,
    corpus: false,
    phase: false
  });
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? nodes[0];
  const selectedPhaseSlideSetting = getPhaseSlideSetting(phaseSlideSettings, selectedNode.phase);
  const selectedSlideCount = normalizeSlideCountSetting(selectedPhaseSlideSetting);
  const selectedSlideIndex = clamp(selectedSlideByNode[selectedNode.id] ?? 0, 0, selectedSlideCount - 1);
  const selectedSlideSettings = getSlideSettings(slideSettingsByKey, selectedNode, selectedSlideIndex);
  const selectedLearningLocus = getLearningLocusFromComponent(selectedNode);
  const slideGenerationContext = buildSlideGenerationContext({
    node: selectedNode,
    form,
    selectedCorpusItems,
    masterySettings,
    learningLocus: selectedLearningLocus,
    slideIndex: selectedSlideIndex,
    slideCount: selectedSlideCount,
    slideSettings: selectedSlideSettings
  });
  const slide = makeLearningSlide(
    selectedNode,
    variantIndex,
    selectedSlideIndex,
    selectedSlideSettings,
    dynamicGenerationEnabled,
    slideGenerationContext
  );
  const courseVisual = getCourseVisual({
    visualSettings: learnerVisualSettings,
    form,
    selectedNode,
    slide,
    selectedCorpusItems
  });
  const learningScreen = makeLearningScreen(selectedNode, slide, screenStatuses[selectedNode.id] ?? "not_started");
  const isDesignerMode = mode === "designer";
  const isLearnerMode = mode === "learner";
  const showDesignerPanel = isDesignerMode && !isDesignerPanelCollapsed;
  const showSlidePanel = !isSlidePanelCollapsed;
  const dashboardStyle = {
    "--left-panel-width": `${paneWidths.left}px`,
    "--right-panel-width": `${paneWidths.right}px`
  };
  const targetDokNumber = getDokFromSetting(form.targetDok, selectedNode?.dok ?? 3);
  const recommendedCorpusItems = getRecommendedCorpusItems({
    theme: form.theme,
    dokLevel: targetDokNumber,
    accessibilityLevel: form.targetAccess
  });
  const corpusSearchResults = searchCorpus(corpusQuery || form.theme);

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleDesignerSection(sectionId) {
    setOpenDesignerSections((current) => ({ ...current, [sectionId]: !current[sectionId] }));
  }

  function updatePhaseSlideSetting(nextSetting) {
    const phase = Number(selectedNode.phase);
    const nextCount = normalizeSlideCountSetting(nextSetting);
    setPhaseSlideSettings((current) => ({ ...current, [phase]: nextSetting }));
    setSelectedSlideByNode((current) => ({
      ...current,
      [selectedNode.id]: clamp(current[selectedNode.id] ?? 0, 0, nextCount - 1)
    }));
  }

  function updateSelectedSlideIndex(index) {
    setSelectedSlideByNode((current) => ({ ...current, [selectedNode.id]: index }));
  }

  function updateSelectedSlideSettings(nextSettings) {
    setSlideSettingsByKey((current) => ({
      ...current,
      [getSlideKey(selectedNode.id, selectedSlideIndex)]: nextSettings
    }));
  }

  function goToPreviousCourseSlide() {
    if (selectedSlideIndex > 0) {
      updateSelectedSlideIndex(selectedSlideIndex - 1);
      return;
    }
    const currentNodeIndex = nodes.findIndex((node) => node.id === selectedNode.id);
    const previousNode = nodes[clamp(currentNodeIndex - 1, 0, nodes.length - 1)];
    if (previousNode && previousNode.id !== selectedNode.id) {
      setSelectedNodeId(previousNode.id);
      const previousCount = normalizeSlideCountSetting(getPhaseSlideSetting(phaseSlideSettings, previousNode.phase));
      setSelectedSlideByNode((current) => ({ ...current, [previousNode.id]: previousCount - 1 }));
    }
  }

  function goToNextCourseSlide() {
    if (selectedSlideIndex < selectedSlideCount - 1) {
      updateSelectedSlideIndex(selectedSlideIndex + 1);
      return;
    }
    const currentNodeIndex = nodes.findIndex((node) => node.id === selectedNode.id);
    const nextNode = nodes[clamp(currentNodeIndex + 1, 0, nodes.length - 1)];
    if (nextNode && nextNode.id !== selectedNode.id) {
      setSelectedNodeId(nextNode.id);
      setSelectedSlideByNode((current) => ({ ...current, [nextNode.id]: 0 }));
    }
  }

  function startPaneResize(side, event) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = paneWidths[side];
    const minWidth = side === "left" ? 260 : 300;
    const maxWidth = side === "left" ? 520 : 560;

    function handleMove(moveEvent) {
      const delta = moveEvent.clientX - startX;
      const nextWidth = side === "left" ? startWidth + delta : startWidth - delta;
      setPaneWidths((current) => ({
        ...current,
        [side]: clamp(nextWidth, minWidth, maxWidth)
      }));
    }

    function stopResize() {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopResize);
      document.body.classList.remove("is-resizing-pane");
    }

    document.body.classList.add("is-resizing-pane");
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopResize);
  }

  function enterMapFocusMode() {
    setIsMapFocusMode(true);
    setIsDesignerPanelCollapsed(true);
    setIsSlidePanelCollapsed(true);
  }

  function exitMapFocusMode() {
    setIsMapFocusMode(false);
    setIsDesignerPanelCollapsed(false);
    setIsSlidePanelCollapsed(false);
  }

  function generatePath() {
    const locusSettings = {
      weightingPreference: learningLocusSettings.weightingPreference,
      overrideLabel: "Auto-evaluate"
    };
    const corpusNodes = selectedCorpusItems.map((item) => makeCorpusNode(item, form, masterySettings.halftonePromptPercent, locusSettings));
    const nextNodes = [...makeNodes(form, masterySettings.halftonePromptPercent, locusSettings), ...corpusNodes];
    setNodes(nextNodes);
    setSelectedNodeId(nextNodes[0].id);
    setVariantIndex(0);
    setScreenStatuses({});
    setMasteryCheckpoints({});
    setAdaptiveSubModules({});
    setExpandedProjectionIds({});
  }

  function loadSampleConcept(sample) {
    const sampleForm = {
      ...form,
      theme: sample.title,
      goal: `Demonstrate mastery learning with ${sample.title}: ${sample.theme}.`,
      targetDok: getCognitiveLabel(sample.node.dok),
      targetAccess: sample.node.access
    };
    const sampleNode = makeSampleNode(sample, sampleForm, masterySettings.halftonePromptPercent, {
      weightingPreference: learningLocusSettings.weightingPreference,
      overrideLabel: learningLocusSettings.selectedOverride
    });
    setForm(sampleForm);
    setNodes([sampleNode]);
    setSelectedNodeId(sampleNode.id);
    setVariantIndex(0);
    setMasterySettings((current) => ({
      ...current,
      enabled: true,
      preferredDokTarget: getCognitiveLabel(sample.node.dok),
      preferredAccessibilityTarget: sample.node.access
    }));
    setScreenStatuses({});
    setMasteryCheckpoints({});
    setAdaptiveSubModules({});
    setExpandedProjectionIds({});
  }

  function addCorpusItemToModule(item) {
    setSelectedCorpusItems((current) => (current.some((selected) => selected.id === item.id) ? current : [...current, item]));
    const corpusNode = makeCorpusNode(item, form, masterySettings.halftonePromptPercent, {
      weightingPreference: learningLocusSettings.weightingPreference,
      overrideLabel: learningLocusSettings.selectedOverride
    });
    setNodes((current) => (current.some((node) => node.id === corpusNode.id) ? current : [...current, corpusNode]));
    setSelectedNodeId(corpusNode.id);
  }

  function generateMasteryPathFromCorpus(item) {
    const targetCognitiveLabel = getCognitiveLabel(getCognitiveIdFromSetting(mapDokTargetsToCognitiveTargets(item.dokTargets).at(-1), 4));
    const corpusForm = {
      ...form,
      theme: item.title,
      goal: `Generate a source-backed mastery path from ${item.title}: ${item.summary}`,
      targetDok: targetCognitiveLabel,
      targetAccess: item.accessibilityTargets[item.accessibilityTargets.length - 1] ?? "Specific"
    };
    const corpusNode = makeCorpusNode(item, corpusForm, masterySettings.halftonePromptPercent, {
      weightingPreference: learningLocusSettings.weightingPreference,
      overrideLabel: learningLocusSettings.selectedOverride
    });
    const corpusSlide = makeSlide(corpusNode, 0);
    const corpusScreen = makeLearningScreen(corpusNode, corpusSlide, "needs_support");
    const subModule = generateMasterySubModule(corpusScreen, masterySettings, "needs_support");

    setForm(corpusForm);
    setSelectedCorpusItems((current) => (current.some((selected) => selected.id === item.id) ? current : [...current, item]));
    setNodes((current) => (current.some((node) => node.id === corpusNode.id) ? current : [...current, corpusNode]));
    setSelectedNodeId(corpusNode.id);
    setScreenStatuses((current) => ({ ...current, [corpusNode.id]: "needs_support" }));
    setMasteryCheckpoints((current) => ({
      ...current,
      [corpusNode.id]: {
        screenId: corpusNode.id,
        learnerConfidence: "low",
        responseQuality: "needs_support",
        notes: "Designer generated a source-backed mastery path directly from the knowledge corpus.",
        mastered: false
      }
    }));
    setAdaptiveSubModules((current) => ({ ...current, [corpusNode.id]: subModule }));
    setExpandedProjectionIds((current) => ({ ...current, [corpusNode.id]: true }));
  }

  function updateLearningLocusSettings(nextSettings) {
    setLearningLocusSettings(nextSettings);
    if (!selectedNode) return;
    setNodes((current) =>
      current.map((node) =>
        node.id === selectedNode.id
          ? enrichNodeWithLearningLocus(node, nextSettings.weightingPreference, nextSettings.selectedOverride)
          : node
      )
    );
  }

  function toggleProjection(nodeId) {
    setExpandedProjectionIds((current) => ({ ...current, [nodeId]: !current[nodeId] }));
  }

  function handleMasteryChoice(choice) {
    const mastered = choice === "mastered";
    const status = mastered ? "mastered" : choice === "needs_support" ? "needs_support" : "in_progress";
    const checkpoint = {
      screenId: learningScreen.id,
      learnerConfidence: mastered ? "high" : choice === "challenge" ? "high" : "low",
      responseQuality: mastered ? "satisfactory" : choice === "challenge" ? "satisfactory" : "needs_support",
      notes: mastered
        ? "Learner marked this screen as understood."
        : choice === "challenge"
          ? "Learner requested a more open-ended extension path."
          : "Learner requested a scaffolded adaptive sub-module.",
      mastered
    };

    setScreenStatuses((current) => ({ ...current, [learningScreen.id]: status }));
    setMasteryCheckpoints((current) => ({ ...current, [learningScreen.id]: checkpoint }));

    if (!mastered) {
      const nextSubModule = generateMasterySubModule(learningScreen, masterySettings, choice);
      setAdaptiveSubModules((current) => ({ ...current, [learningScreen.id]: nextSubModule }));
      setExpandedProjectionIds((current) => ({ ...current, [learningScreen.id]: true }));
    }
  }

  async function copySlide() {
    const copy = `${slide.title}

Phase ${selectedNode.phase} | Slide ${selectedSlideIndex + 1} of ${selectedSlideCount} | ${slideTypeLabels[slide.slideType]} | ${getCognitiveLabel(selectedNode.dok)} | ${selectedNode.access} | ${getLearningLocusFromComponent(selectedNode).label} | ${selectedNode.audience}

Concept:
${slide.concept}

Why it matters:
${slide.why}

Quick learner task:
${slide.task}

Go deeper:
${slide.deeper.map((item) => `- ${item}`).join("\n")}
${slide.sources ? `\nSources:\n${slide.sources.map((source) => `- ${source.label}: ${source.url}`).join("\n")}` : ""}
${slide.prompt ? `\nSuggested Image Prompt:\n${slide.prompt}` : ""}`;
    await navigator.clipboard.writeText(copy);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div>
            <div className="eyebrow">
              <Sparkles size={16} /> Museum Education Prototype
            </div>
            <h1>Dual-Axis Learning Composer</h1>
            <p>Generate learning paths from cognitive depth x knowledge accessibility.</p>
          </div>
          <div className="header-tools">
            <ModeToggle mode={mode} setMode={setMode} />
            {isLearnerMode ? <LearnerViewToggle learnerView={learnerView} onChange={setLearnerView} /> : null}
          </div>
        </div>
      </header>

      {isLearnerMode && learnerView === "course" ? (
        <CourseView
          learnerView={learnerView}
          onLearnerViewChange={setLearnerView}
          selectedNode={selectedNode}
          slide={slide}
          selectedSlideIndex={selectedSlideIndex}
          selectedSlideCount={selectedSlideCount}
          onSelectSlide={updateSelectedSlideIndex}
          onBack={goToPreviousCourseSlide}
          onNext={goToNextCourseSlide}
          masterySettings={masterySettings}
          mode={mode}
          learningScreen={learningScreen}
          checkpoint={masteryCheckpoints[learningScreen.id]}
          subModule={adaptiveSubModules[learningScreen.id]}
          onMasteryChoice={handleMasteryChoice}
          visual={courseVisual}
        />
      ) : (
      <section
        className={`dashboard ${isLearnerMode ? "learner-dashboard" : "designer-dashboard"}${isDesignerMode && isDesignerPanelCollapsed ? " designer-collapsed" : ""}${!showSlidePanel ? " slide-collapsed" : ""}${isMapFocusMode ? " map-focus-mode" : ""}`}
        style={dashboardStyle}
      >
        {isDesignerMode && isDesignerPanelCollapsed ? (
          <button
            className="collapsed-tab collapsed-tab-left"
            onClick={() => {
              setIsMapFocusMode(false);
              setIsDesignerPanelCollapsed(false);
            }}
          >
            <ChevronsRight size={16} /> Show Designer
          </button>
        ) : null}

        {showDesignerPanel ? (
        <aside className="panel input-panel">
          <div className="panel-heading">
            <div className="icon-box teal">
              <Target size={20} />
            </div>
            <div>
              <h2>Design a Learning Experience</h2>
              <p>Set the audience, phase, and learning range.</p>
            </div>
            <button className="panel-collapse-button" onClick={() => setIsDesignerPanelCollapsed(true)}>
              <ChevronsLeft size={15} /> Hide Designer Panel
            </button>
          </div>

          <div className="designer-action-strip">
            <button className="primary-button full-width generate-button" onClick={generatePath}>
              <Route size={18} /> Generate Learning Path
            </button>
          </div>

          <div className="designer-accordion">
            <AccordionSection id="experience" title="Experience Setup" icon={<Sparkles size={17} />} open={openDesignerSections.experience} onToggle={toggleDesignerSection}>
              <div className="form-stack compact">
                <div className="two-column-fields">
                  <SelectField label="Audience type" value={form.audience} onChange={(value) => updateForm("audience", value)} options={audiences} />
                  <SelectField label="Duration" value={form.duration} onChange={(value) => updateForm("duration", value)} options={durations} />
                </div>
                <label className="field-label">
                  <span>Subject / theme</span>
                  <input className="field-control" value={form.theme} onChange={(event) => updateForm("theme", event.target.value)} />
                </label>
                <label className="field-label">
                  <span>Learning goal</span>
                  <textarea className="field-control textarea" value={form.goal} onChange={(event) => updateForm("goal", event.target.value)} />
                </label>
                <SelectField label="Current phase" value={String(form.phase)} onChange={(value) => updateForm("phase", Number(value))} options={["1", "2", "3", "4", "5", "6"]} />
              </div>
            </AccordionSection>

            <AccordionSection id="axis" title="Axis Settings" icon={<Target size={17} />} open={openDesignerSections.axis} onToggle={toggleDesignerSection}>
              <div className="form-stack compact">
                <div className="two-column-fields">
                  <SelectField label="Starting cognitive level" value={form.startDok} onChange={(value) => updateForm("startDok", value)} options={cognitiveLevelOptions} />
                  <SelectField label="Starting access" value={form.startAccess} onChange={(value) => updateForm("startAccess", value)} options={accessibilityLevels} />
                  <SelectField label="Target cognitive level" value={form.targetDok} onChange={(value) => updateForm("targetDok", value)} options={cognitiveLevelOptions} />
                  <SelectField label="Target access" value={form.targetAccess} onChange={(value) => updateForm("targetAccess", value)} options={accessibilityLevels} />
                </div>
                <div className="theory-note">
                  <h3>Why this axis is not just Webb's DOK</h3>
                  <p>
                    Webb's Depth of Knowledge is used here as a foundation for cognitive complexity, not as a rigid ladder. This prototype adapts DOK alongside Hess's Cognitive Rigor Matrix and Bloom-style progression to create a practical continuum for museum curriculum design. Learners may move upward, downward, or across the continuum as mastery support requires.
                  </p>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection id="locus" title="Learning-Locus Settings" icon={<Target size={17} />} open={openDesignerSections.locus} onToggle={toggleDesignerSection}>
              <div className="form-stack compact">
                <div className="theory-note">
                  <h3>Why these learning-locus labels matter</h3>
                  <p>
                    This system is inspired by Understanding by Design and related learning theories that distinguish between enduring transferable understanding, important supporting knowledge, and contextual familiarity. Placement decisions are informed by transfer relevance, conceptual connectedness, mastery dependencies, and learner meaning-making.
                  </p>
                </div>
                <LearningLocusSettings settings={learningLocusSettings} onChange={updateLearningLocusSettings} selectedNode={selectedNode} />
              </div>
            </AccordionSection>

            <AccordionSection id="mastery" title="Mastery Settings" icon={<Brain size={17} />} open={openDesignerSections.mastery} onToggle={toggleDesignerSection}>
              <DesignerMasterySettings settings={masterySettings} onChange={setMasterySettings} />
            </AccordionSection>

            <AccordionSection id="slides" title="Slide Settings" icon={<BookOpen size={17} />} open={openDesignerSections.slides} onToggle={toggleDesignerSection}>
              <SlideSettingsPanel
                selectedNode={selectedNode}
                selectedSlideIndex={selectedSlideIndex}
                slideCountSetting={selectedPhaseSlideSetting}
                slideSettings={selectedSlideSettings}
                dynamicGenerationEnabled={dynamicGenerationEnabled}
                visualSettings={learnerVisualSettings}
                currentVisual={courseVisual}
                onDynamicGenerationChange={setDynamicGenerationEnabled}
                onVisualSettingsChange={setLearnerVisualSettings}
                onSlideCountChange={updatePhaseSlideSetting}
                onSelectedSlideChange={updateSelectedSlideIndex}
                onSlideSettingsChange={updateSelectedSlideSettings}
              />
            </AccordionSection>

            <AccordionSection id="corpus" title="Corpus / Sources" icon={<BookOpen size={17} />} open={openDesignerSections.corpus} onToggle={toggleDesignerSection}>
              <div className="form-stack compact">
                <SampleConceptPanel onLoadSample={loadSampleConcept} />
                <KnowledgeCorpusPanel
                  corpusQuery={corpusQuery}
                  onCorpusQueryChange={setCorpusQuery}
                  recommendedItems={recommendedCorpusItems}
                  searchResults={corpusSearchResults}
                  selectedCorpusItems={selectedCorpusItems}
                  onUseInModule={addCorpusItemToModule}
                  onGenerateMasteryPath={generateMasteryPathFromCorpus}
                />
              </div>
            </AccordionSection>

            <AccordionSection id="phase" title="Phase Arc" icon={<Layers size={17} />} open={openDesignerSections.phase} onToggle={toggleDesignerSection}>
              <div className="phase-arc compact-phase-arc">
                <ol>
                  {phaseArc.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </AccordionSection>
          </div>
        </aside>
        ) : null}

        {showDesignerPanel ? (
          <div
            className="pane-resizer pane-resizer-left"
            role="separator"
            aria-label="Resize designer panel"
            onMouseDown={(event) => startPaneResize("left", event)}
          />
        ) : null}

        <section className="panel map-panel">
          <div className="map-header">
            <div>
              <h2>Learning Field Map</h2>
              <p>
                Each node represents a learning moment. Its position reflects Cognitive Depth & Transfer x Knowledge Accessibility / At One's Fingertips.
              </p>
              <p className="axis-theory-caption">
                This continuum is informed by Webb's Depth of Knowledge and Hess's Cognitive Rigor Matrix, but adapted for applied museum learning.
              </p>
            </div>
            <div className="map-actions">
              <button className="secondary-button map-focus-button" onClick={isMapFocusMode ? exitMapFocusMode : enterMapFocusMode}>
                {isMapFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                {isMapFocusMode ? "Exit Focus Mode" : "Map Focus Mode"}
              </button>
              <div className="legend">
                {learningLocusLevels.map((level) => (
                  <span className="chip" key={level.key}>
                    {level.symbol} {level.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {navigatorDockPosition === "top-right" ? (
            <PathNavigator
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              hidden={isNavigatorHidden}
              dockPosition={navigatorDockPosition}
              onDockPositionChange={setNavigatorDockPosition}
              onHiddenChange={setIsNavigatorHidden}
            />
          ) : null}

          <div className="map-scroll">
            <div className="learning-grid">
              <div className="axis-corner">Cognitive Depth & Transfer</div>
              {accessibilityLevels.map((level) => (
                <div key={level} className="axis-label axis-top">
                  {level}
                </div>
              ))}
              {[6, 5, 4, 3, 2, 1].map((dok) => (
                <React.Fragment key={dok}>
                  <div className="axis-label axis-side">{getCognitiveLabel(dok)}</div>
                  {accessibilityLevels.map((access) => {
                    const cellNodes = nodes.filter((node) => node.dok === dok && node.access === access);
                    return (
                      <div key={`${dok}-${access}`} className="map-cell">
                        {cellNodes.map((node) => (
                          <div className="node-with-projection" key={node.id}>
                            {(() => {
                              const locus = getLearningLocusFromComponent(node);
                              return (
                            <button
                              className={`node node-${locus.key}${node.id === selectedNodeId ? " selected" : ""}${adaptiveSubModules[node.id] ? " has-projection" : ""}`}
                              onClick={() => setSelectedNodeId(node.id)}
                            >
                              <span className="node-symbol">{locus.symbol}</span>
                              <span>
                                {node.title}
                                <small className="node-locus">{locus.label}</small>
                                <small className={`node-status status-${screenStatuses[node.id] ?? "not_started"}`}>
                                  {masteryStatusLabels[screenStatuses[node.id] ?? "not_started"]}
                                </small>
                              </span>
                            </button>
                              );
                            })()}
                            <TelescopicProjection
                              parentNode={node}
                              subModule={adaptiveSubModules[node.id]}
                              expanded={!!expandedProjectionIds[node.id]}
                              onToggle={() => toggleProjection(node.id)}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
          {navigatorDockPosition !== "top-right" ? (
            <PathNavigator
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              hidden={isNavigatorHidden}
              dockPosition={navigatorDockPosition}
              onDockPositionChange={setNavigatorDockPosition}
              onHiddenChange={setIsNavigatorHidden}
            />
          ) : null}
        </section>

        {showSlidePanel ? (
          <div
            className="pane-resizer pane-resizer-right"
            role="separator"
            aria-label="Resize slide preview panel"
            onMouseDown={(event) => startPaneResize("right", event)}
          />
        ) : null}

        {showSlidePanel ? (
        <aside className="panel slide-panel">
          <div className="slide-panel-heading">
            <div>
              <h2>Learning Slide</h2>
              <p>Preview generated from the selected node.</p>
            </div>
            <BookOpen className="heading-icon" size={24} />
            <button className="panel-collapse-button" onClick={() => setIsSlidePanelCollapsed(true)}>
              Hide Slide Preview <ChevronsRight size={15} />
            </button>
          </div>

          <article className="slide-card">
            <SlideStepper
              slideCount={selectedSlideCount}
              selectedSlideIndex={selectedSlideIndex}
              onSelectSlide={updateSelectedSlideIndex}
              slideSettingsByKey={slideSettingsByKey}
              selectedNode={selectedNode}
            />
            <h3>{slide.title}</h3>
            <div className="chip-row">
              <span className="chip">Phase {selectedNode.phase}</span>
              <span className="chip">Slide {selectedSlideIndex + 1} of {selectedSlideCount}</span>
              <span className="chip">{slideTypeLabels[slide.slideType]}</span>
              <span className="chip">{getCognitiveLabel(selectedNode.dok)}</span>
              <span className="chip">{selectedNode.access}</span>
              <span className="chip">{getLearningLocusFromComponent(selectedNode).label}</span>
              <span className="chip">{selectedNode.audience}</span>
            </div>

            <div className="halftone">
              <div className="placeholder-card">
                <div>Generated image placeholder</div>
                <span>{selectedNode.theme}</span>
              </div>
            </div>

            {slide.prompt ? (
              <div className="prompt-box">
                <div className="section-label">
                  <Info size={15} /> Suggested Image Prompt
                </div>
                <p>{slide.prompt}</p>
              </div>
            ) : null}

            <div className="slide-copy">
              <section>
                <h4>Learning locus</h4>
                <div className="locus-rationale-box">
                  <strong>{getLearningLocusFromComponent(selectedNode).label}</strong>
                  <p>{selectedNode.learningLocusRationale}</p>
                </div>
              </section>
              <section>
                <h4>Concept explanation</h4>
                <p>{slide.concept}</p>
              </section>
              <section>
                <h4>Why it matters</h4>
                <p>{slide.why}</p>
              </section>
              <section>
                <h4>Quick learner task</h4>
                <p>{slide.task}</p>
              </section>
              <section>
                <h4>Go deeper</h4>
                <ul>
                  {slide.deeper.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              {slide.learningUses ? (
                <section>
                  <h4>Corpus learning uses</h4>
                  <div className="chip-row tight">
                    {slide.learningUses.map((use) => (
                      <span className="chip" key={use}>
                        {use}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}
              {slide.sources ? (
                <section>
                  <h4>Recommended sources</h4>
                  <div className="source-list">
                    {slide.sources.map((source) => (
                      <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                        {source.label}
                      </a>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            {isLearnerMode || showLearnerPreview ? <LearnerActivity slide={slide} /> : null}

            {isDesignerMode ? (
              <div className="learner-preview-toggle">
                <CheckboxField
                  label="Show learner mastery preview"
                  checked={showLearnerPreview}
                  onChange={setShowLearnerPreview}
                />
                <p>Learner checkpoint buttons stay hidden in Designer Mode unless this preview is enabled.</p>
              </div>
            ) : null}

            {isLearnerMode || showLearnerPreview ? (
              <MasteryLearningArea
                enabled={masterySettings.enabled}
                mode={mode}
                learningScreen={learningScreen}
                checkpoint={masteryCheckpoints[learningScreen.id]}
                subModule={adaptiveSubModules[learningScreen.id]}
                onChoice={handleMasteryChoice}
              />
            ) : null}
          </article>

          {isDesignerMode ? (
          <div className="button-grid slide-action-bar">
            <button className="secondary-button" onClick={copySlide}>
              <Clipboard size={17} /> Export slide copy
            </button>
            <button className="secondary-button" onClick={() => setVariantIndex((current) => current + 1)}>
              <RefreshCcw size={17} /> Regenerate mock slide
            </button>
          </div>
          ) : null}
        </aside>
        ) : (
          <button
            className="collapsed-tab collapsed-tab-right"
            onClick={() => {
              setIsMapFocusMode(false);
              setIsSlidePanelCollapsed(false);
            }}
          >
            Show Slide <ChevronsLeft size={16} />
          </button>
        )}
      </section>
      )}

      <footer className="app-footer">
        Dual-axis curriculum design workspace for museum learning, mastery pathways, and adaptive course experiences.
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);


