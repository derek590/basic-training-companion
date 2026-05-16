import { useState, useEffect, useRef } from "react";

const BRANCHES = {
  army: {
    name: "Army", fullName: "United States Army",
    trainingName: "Basic Combat Training (BCT)",
    color: "#4a7c59", accent: "#c8a84b", dark: "#1a2e1f",
    motto: "This We'll Defend", duration: 10,
    ranks: [
      { abbr: "PVT", name: "Private", grade: "E-1" },
      { abbr: "PV2", name: "Private Second Class", grade: "E-2" },
      { abbr: "PFC", name: "Private First Class", grade: "E-3" },
      { abbr: "SPC", name: "Specialist", grade: "E-4" },
      { abbr: "CPL", name: "Corporal", grade: "E-4" },
      { abbr: "SGT", name: "Sergeant", grade: "E-5" },
      { abbr: "SSG", name: "Staff Sergeant", grade: "E-6" },
      { abbr: "SFC", name: "Sergeant First Class", grade: "E-7" },
      { abbr: "MSG", name: "Master Sergeant", grade: "E-8" },
      { abbr: "1SG", name: "First Sergeant", grade: "E-8" },
      { abbr: "SGM", name: "Sergeant Major", grade: "E-9" },
    ],
    acronyms: [
      { abbr: "BCT", meaning: "Basic Combat Training" },
      { abbr: "DS", meaning: "Drill Sergeant" },
      { abbr: "PT", meaning: "Physical Training" },
      { abbr: "ACFT", meaning: "Army Combat Fitness Test" },
      { abbr: "AIT", meaning: "Advanced Individual Training" },
      { abbr: "MRE", meaning: "Meal Ready to Eat" },
      { abbr: "OCP", meaning: "Operational Camouflage Pattern" },
      { abbr: "FOB", meaning: "Forward Operating Base" },
      { abbr: "CO", meaning: "Commanding Officer" },
      { abbr: "CQ", meaning: "Charge of Quarters" },
      { abbr: "AWOL", meaning: "Absent Without Leave" },
      { abbr: "PX", meaning: "Post Exchange (store on base)" },
      { abbr: "KP", meaning: "Kitchen Police (kitchen duty)" },
      { abbr: "SOP", meaning: "Standard Operating Procedure" },
    ],
    keyTerms: [
      { term: "Battle Buddy", def: "A soldier always paired with another for safety and support" },
      { term: "Drill Sergeant", def: "NCO responsible for training recruits" },
      { term: "Formation", def: "Organized arrangement of soldiers for inspection or movement" },
      { term: "Barracks", def: "Living quarters for enlisted soldiers" },
      { term: "Reveille", def: "Morning bugle call to wake soldiers" },
      { term: "Taps", def: "Bugle call played at end of day / lights out" },
      { term: "HOOAH", def: "Army expression of acknowledgment, enthusiasm, or affirmation" },
      { term: "Blue Phase", def: "Weeks 1-3: Reception and adjustment" },
      { term: "Red Phase", def: "Weeks 4-5: Core combat skills" },
      { term: "White Phase", def: "Weeks 6-7: Weapons and field training" },
      { term: "Black Phase", def: "Weeks 8-10: Advanced tactics and graduation prep" },
    ],
    weeklyEvents: [
      { week: 1, title: "Reception Week", events: [
        { name: "In-processing", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Medical screenings", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
        { name: "Haircuts", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Uniform issue", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Initial PT assessment", url: "https://www.army.mil/acft/" },
      ]},
      { week: 2, title: "Blue Phase Begins", events: [
        { name: "Drill and ceremony", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "First aid training", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
        { name: "Core values instruction", url: "https://www.army.mil/values/" },
        { name: "Physical fitness routines begin", url: "https://www.army.mil/acft/" },
      ]},
      { week: 3, title: "Physical Conditioning", events: [
        { name: "Advanced PT", url: "https://www.army.mil/acft/" },
        { name: "Obstacle courses", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Land navigation intro", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Team-building exercises", url: "https://www.goarmy.com/army-life/basic-training" },
      ]},
      { week: 4, title: "Red Phase - Combat Skills", events: [
        { name: "Rifle marksmanship begins", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Pugil stick training", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Combatives (hand-to-hand)", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "NBC Chemical training", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
      ]},
      { week: 5, title: "Weapons Qualification", events: [
        { name: "M16/M4 qualification", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Grenade training", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Field exercises", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Night operations intro", url: "https://www.goarmy.com/army-life/basic-training" },
      ]},
      { week: 6, title: "White Phase - Field Training", events: [
        { name: "Extended field exercises", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Tactical movement", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Patrol techniques", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Survival skills", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
      ]},
      { week: 7, title: "Advanced Field Operations", events: [
        { name: "Live-fire exercises", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "ACFT practice", url: "https://www.army.mil/acft/" },
        { name: "Leadership challenges", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Buddy team exercises", url: "https://www.goarmy.com/army-life/basic-training" },
      ]},
      { week: 8, title: "Black Phase Begins", events: [
        { name: "Advanced tactical ops", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "ACFT official test", url: "https://www.army.mil/acft/" },
        { name: "Final weapons qual", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Senior leadership mentoring", url: "https://www.goarmy.com/army-life/basic-training" },
      ]},
      { week: 9, title: "Victory Forge Prep", events: [
        { name: "Final field training exercise", url: "https://sill-www.army.mil/434/ten-week-journey/" },
        { name: "Culminating event prep", url: "https://sill-www.army.mil/434/ten-week-journey/" },
        { name: "Letter writing final", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Family contact window", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
      ]},
      { week: 10, title: "Graduation Week", events: [
        { name: "Victory Forge completion", url: "https://sill-www.army.mil/434/ten-week-journey/" },
        { name: "Transition to AIT briefings", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Graduation ceremony", url: "https://www.goarmy.com/army-life/basic-training" },
        { name: "Family Day activities", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
      ]},
    ],
  },
  airforce: {
    name: "Air Force", fullName: "United States Air Force",
    trainingName: "Basic Military Training (BMT)",
    color: "#1a3a5c", accent: "#4a90d9", dark: "#0d1f33",
    motto: "Aim High… Fly-Fight-Win", duration: 8,
    ranks: [
      { abbr: "AB", name: "Airman Basic", grade: "E-1" },
      { abbr: "Amn", name: "Airman", grade: "E-2" },
      { abbr: "A1C", name: "Airman First Class", grade: "E-3" },
      { abbr: "SrA", name: "Senior Airman", grade: "E-4" },
      { abbr: "SSgt", name: "Staff Sergeant", grade: "E-5" },
      { abbr: "TSgt", name: "Technical Sergeant", grade: "E-6" },
      { abbr: "MSgt", name: "Master Sergeant", grade: "E-7" },
      { abbr: "SMSgt", name: "Senior Master Sergeant", grade: "E-8" },
      { abbr: "CMSgt", name: "Chief Master Sergeant", grade: "E-9" },
    ],
    acronyms: [
      { abbr: "BMT", meaning: "Basic Military Training" },
      { abbr: "MTI", meaning: "Military Training Instructor" },
      { abbr: "PT", meaning: "Physical Training" },
      { abbr: "AFSC", meaning: "Air Force Specialty Code (job)" },
      { abbr: "TDY", meaning: "Temporary Duty Assignment" },
      { abbr: "AETC", meaning: "Air Education and Training Command" },
      { abbr: "OCP", meaning: "Operational Camouflage Pattern" },
      { abbr: "PRT", meaning: "Physical Readiness Test" },
    ],
    keyTerms: [
      { term: "MTI", def: "Military Training Instructor - the Air Force equivalent of Drill Sergeant" },
      { term: "Flight", def: "Basic unit of Air Force organization (like a platoon)" },
      { term: "Dorm", def: "Trainee living quarters at Lackland AFB" },
      { term: "Warrior Week", def: "Culminating field training event in week 7" },
      { term: "BEAST", def: "Basic Expeditionary Airman Skills Training" },
      { term: "Coin", def: "Challenge coin awarded for achievement" },
      { term: "Element", def: "Subdivision of a flight (12-15 trainees)" },
    ],
    weeklyEvents: [
      { week: 1, title: "Zero Week / Reception", events: [
        { name: "In-processing", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Medical screenings", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
        { name: "Haircuts and uniform issue", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Initial PT baseline", url: "https://www.airforce.com/training/military-training/bmt" },
      ]},
      { week: 2, title: "Week 1 - Foundations", events: [
        { name: "Drill and ceremonies", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Air Force history and values", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Physical conditioning begins", url: "https://www.airforce.com/training/military-training/bmt" },
      ]},
      { week: 3, title: "Week 2 - Core Skills", events: [
        { name: "Weapons handling M16", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Self-aid and buddy care", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Uniform and appearance standards", url: "https://www.airforce.com/training/military-training/bmt" },
      ]},
      { week: 4, title: "Week 3 - Combat Readiness", events: [
        { name: "M16 qualification", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Gas chamber training", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Fitness testing", url: "https://www.airforce.com/training/military-training/bmt" },
      ]},
      { week: 5, title: "Week 4 - Field Operations", events: [
        { name: "Field training exercises", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Land navigation", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Survival techniques", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
      ]},
      { week: 6, title: "Week 5 - Advanced Training", events: [
        { name: "BEAST preparation", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Leadership evaluation", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "PT assessment", url: "https://www.airforce.com/training/military-training/bmt" },
      ]},
      { week: 7, title: "Warrior Week (BEAST)", events: [
        { name: "Full field deployment exercise", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Combat simulations", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Team leadership roles", url: "https://www.airforce.com/training/military-training/bmt" },
      ]},
      { week: 8, title: "Graduation Week", events: [
        { name: "Return from BEAST", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Coin ceremony", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Airman's Run", url: "https://www.airforce.com/training/military-training/bmt" },
        { name: "Graduation parade", url: "https://www.airforce.com/training/military-training/bmt" },
      ]},
    ],
  },
  navy: {
    name: "Navy", fullName: "United States Navy",
    trainingName: "Recruit Training Command (RTC)",
    color: "#1b2a4a", accent: "#c8960c", dark: "#0e1829",
    motto: "Forged by the Sea", duration: 8,
    ranks: [
      { abbr: "SR", name: "Seaman Recruit", grade: "E-1" },
      { abbr: "SA", name: "Seaman Apprentice", grade: "E-2" },
      { abbr: "SN", name: "Seaman", grade: "E-3" },
      { abbr: "PO3", name: "Petty Officer Third Class", grade: "E-4" },
      { abbr: "PO2", name: "Petty Officer Second Class", grade: "E-5" },
      { abbr: "PO1", name: "Petty Officer First Class", grade: "E-6" },
      { abbr: "CPO", name: "Chief Petty Officer", grade: "E-7" },
      { abbr: "SCPO", name: "Senior Chief Petty Officer", grade: "E-8" },
      { abbr: "MCPO", name: "Master Chief Petty Officer", grade: "E-9" },
    ],
    acronyms: [
      { abbr: "RTC", meaning: "Recruit Training Command (Great Lakes, IL)" },
      { abbr: "RDC", meaning: "Recruit Division Commander" },
      { abbr: "PRT", meaning: "Physical Readiness Test" },
      { abbr: "NWU", meaning: "Navy Working Uniform" },
      { abbr: "USS", meaning: "United States Ship" },
      { abbr: "XO", meaning: "Executive Officer (second in command)" },
      { abbr: "NAS", meaning: "Naval Air Station" },
    ],
    keyTerms: [
      { term: "Division", def: "Group of recruits trained together" },
      { term: "RDC", def: "Recruit Division Commander - Navy's Drill Instructor" },
      { term: "Rack", def: "Bunk bed / sleeping area" },
      { term: "Galley", def: "Kitchen / cafeteria on a ship or base" },
      { term: "Battle Stations", def: "Final culminating 12-hour training evolution" },
      { term: "Pass in Review", def: "Navy graduation parade ceremony" },
      { term: "Liberty", def: "Authorized time off base" },
    ],
    weeklyEvents: [
      { week: 1, title: "Processing Week", events: [
        { name: "In-processing at RTC Great Lakes", url: "https://www.bootcamp.navy.mil/" },
        { name: "Medical screenings", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
        { name: "Uniform issue", url: "https://www.bootcamp.navy.mil/" },
        { name: "Division assignment", url: "https://www.bootcamp.navy.mil/" },
      ]},
      { week: 2, title: "Week 1 - Foundations", events: [
        { name: "Seamanship basics", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "Navy customs and courtesies", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "Drill practice", url: "https://www.bootcamp.navy.mil/Recruits/" },
      ]},
      { week: 3, title: "Week 2 - Core Navy Skills", events: [
        { name: "Damage control training", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "Firefighting basics", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "First aid / CPR", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
      ]},
      { week: 4, title: "Week 3 - Warfare Training", events: [
        { name: "Weapons familiarization", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "Chemical defense", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "Swim qualification", url: "https://www.bootcamp.navy.mil/Recruits/" },
      ]},
      { week: 5, title: "Week 4 - Advanced Skills", events: [
        { name: "Seamanship advanced", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "Navigation basics", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "Division competitions", url: "https://www.bootcamp.navy.mil/" },
      ]},
      { week: 6, title: "Week 5 - Tactical Operations", events: [
        { name: "Tactical training", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "Team problem solving", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "Battle Stations prep", url: "https://www.bootcamp.navy.mil/Recruits/" },
      ]},
      { week: 7, title: "Week 6 - Battle Stations", events: [
        { name: "12-hour Battle Stations event", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "Transition from recruit to sailor", url: "https://www.bootcamp.navy.mil/Recruits/" },
        { name: "Uniform change ceremony", url: "https://www.bootcamp.navy.mil/" },
      ]},
      { week: 8, title: "Graduation Week", events: [
        { name: "Final inspections", url: "https://www.bootcamp.navy.mil/Families/" },
        { name: "Pass in Review ceremony", url: "https://www.bootcamp.navy.mil/Families/" },
        { name: "Liberty granted", url: "https://www.bootcamp.navy.mil/Families/" },
        { name: "Orders to A-School", url: "https://www.bootcamp.navy.mil/Recruits/" },
      ]},
    ],
  },
  marines: {
    name: "Marines", fullName: "United States Marine Corps",
    trainingName: "Marine Corps Recruit Training",
    color: "#8b0000", accent: "#c8a84b", dark: "#3d0000",
    motto: "Semper Fidelis - Always Faithful", duration: 13,
    ranks: [
      { abbr: "Pvt", name: "Private", grade: "E-1" },
      { abbr: "PFC", name: "Private First Class", grade: "E-2" },
      { abbr: "LCpl", name: "Lance Corporal", grade: "E-3" },
      { abbr: "Cpl", name: "Corporal", grade: "E-4" },
      { abbr: "Sgt", name: "Sergeant", grade: "E-5" },
      { abbr: "SSgt", name: "Staff Sergeant", grade: "E-6" },
      { abbr: "GySgt", name: "Gunnery Sergeant", grade: "E-7" },
      { abbr: "MSgt", name: "Master Sergeant", grade: "E-8" },
      { abbr: "1stSgt", name: "First Sergeant", grade: "E-8" },
      { abbr: "MGySgt", name: "Master Gunnery Sergeant", grade: "E-9" },
    ],
    acronyms: [
      { abbr: "MCRD", meaning: "Marine Corps Recruit Depot" },
      { abbr: "DI", meaning: "Drill Instructor" },
      { abbr: "PFT", meaning: "Physical Fitness Test" },
      { abbr: "CFT", meaning: "Combat Fitness Test" },
      { abbr: "MOS", meaning: "Military Occupational Specialty (job code)" },
      { abbr: "EGA", meaning: "Eagle, Globe and Anchor (Marine Corps emblem)" },
      { abbr: "MCT", meaning: "Marine Combat Training (after boot camp)" },
    ],
    keyTerms: [
      { term: "Drill Instructor", def: "Marine NCO responsible for transforming recruits into Marines" },
      { term: "Platoon", def: "Recruit training unit of 40-90 recruits" },
      { term: "Rack", def: "Bunk / sleeping area" },
      { term: "Hatch", def: "Door (Marine Corps term)" },
      { term: "Deck", def: "Floor (Marine Corps term)" },
      { term: "The Crucible", def: "54-hour culminating event - final test before earning the EGA" },
      { term: "EGA Ceremony", def: "The moment a recruit officially becomes a Marine" },
    ],
    weeklyEvents: [
      { week: 1, title: "Receiving Week", events: [
        { name: "Arrival at MCRD", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "In-processing", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Gear issue", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Initial strength test", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
      ]},
      { week: 2, title: "Phase 1 Begins", events: [
        { name: "Close order drill", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Core values", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Physical conditioning", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Swim qualification", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
      ]},
      { week: 3, title: "Physical Conditioning", events: [
        { name: "Obstacle courses", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Pugil stick fighting", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "MCMAP martial arts intro", url: "https://www.marines.com/become-a-marine/process-to-join/" },
      ]},
      { week: 4, title: "Team Building", events: [
        { name: "Confidence courses", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Team tactics", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "First aid training", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
      ]},
      { week: 5, title: "Phase 2 - Rifle Range", events: [
        { name: "Grass week dry fire", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Known distance shooting", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Rifle qualification begins", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
      ]},
      { week: 6, title: "Rifle Qualification", events: [
        { name: "Official rifle qualification", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Field exercises", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Combat marksmanship", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
      ]},
      { week: 7, title: "Field Skills", events: [
        { name: "Land navigation", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Patrolling techniques", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Field living", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
      ]},
      { week: 8, title: "Phase 3 - Advanced Combat", events: [
        { name: "Advanced combat training", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "NBC defense", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
        { name: "Night operations", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
      ]},
      { week: 9, title: "Warrior Skills", events: [
        { name: "Combat endurance course", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Water survival", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Leadership evaluations", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
      ]},
      { week: 10, title: "Crucible Preparation", events: [
        { name: "Mental and physical preparation", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Final PFT", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Gear prep", url: "https://www.mcrdpi.marines.mil/Recruit-Training/Crucible/" },
      ]},
      { week: 11, title: "The Crucible", events: [
        { name: "54-hour culminating event begins", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Limited sleep and food", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Team challenges", url: "https://www.mcrdpi.marines.mil/Recruit-Training/Crucible/" },
      ]},
      { week: 12, title: "Eagle Globe and Anchor", events: [
        { name: "Crucible completion", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "EGA ceremony", url: "https://www.marines.com/become-a-marine/process-to-join/" },
        { name: "Family notification", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
      ]},
      { week: 13, title: "Graduation Week", events: [
        { name: "Final drill evaluations", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Family Day", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
        { name: "Graduation ceremony", url: "https://www.mcrdpi.marines.mil/Recruit-Training/" },
        { name: "Orders to MCT", url: "https://www.marines.com/become-a-marine/process-to-join/" },
      ]},
    ],
  },
  coastguard: {
    name: "Coast Guard", fullName: "United States Coast Guard",
    trainingName: "Recruit Training (Cape May, NJ)",
    color: "#1a3a5c", accent: "#e87722", dark: "#0d1f33",
    motto: "Semper Paratus - Always Ready", duration: 8,
    ranks: [
      { abbr: "SR", name: "Seaman Recruit", grade: "E-1" },
      { abbr: "SA", name: "Seaman Apprentice", grade: "E-2" },
      { abbr: "SN", name: "Seaman", grade: "E-3" },
      { abbr: "PO3", name: "Petty Officer Third Class", grade: "E-4" },
      { abbr: "PO2", name: "Petty Officer Second Class", grade: "E-5" },
      { abbr: "PO1", name: "Petty Officer First Class", grade: "E-6" },
      { abbr: "CPO", name: "Chief Petty Officer", grade: "E-7" },
      { abbr: "SCPO", name: "Senior Chief Petty Officer", grade: "E-8" },
      { abbr: "MCPO", name: "Master Chief Petty Officer", grade: "E-9" },
    ],
    acronyms: [
      { abbr: "TRACEN", meaning: "Training Center Cape May (boot camp location)" },
      { abbr: "CC", meaning: "Company Commander (like a Drill Instructor)" },
      { abbr: "PT", meaning: "Physical Training" },
      { abbr: "PRT", meaning: "Physical Readiness Test" },
      { abbr: "USCG", meaning: "United States Coast Guard" },
      { abbr: "SAR", meaning: "Search and Rescue" },
      { abbr: "MLE", meaning: "Maritime Law Enforcement" },
      { abbr: "NWU", meaning: "Navy Working Uniform (worn by Coast Guard)" },
      { abbr: "XO", meaning: "Executive Officer (second in command)" },
      { abbr: "CO", meaning: "Commanding Officer" },
      { abbr: "A-School", meaning: "Coast Guard technical training after boot camp" },
      { abbr: "TDY", meaning: "Temporary Duty Assignment" },
    ],
    keyTerms: [
      { term: "Company Commander", def: "Coast Guard NCO responsible for training recruits - equivalent to Drill Instructor" },
      { term: "Company", def: "Group of recruits trained together at Cape May" },
      { term: "Cape May", def: "Cape May, New Jersey - the only Coast Guard recruit training location" },
      { term: "Swab", def: "Nickname for a Coast Guard recruit during boot camp" },
      { term: "Rack", def: "Bunk / sleeping area" },
      { term: "Galley", def: "Kitchen / cafeteria" },
      { term: "Heave To", def: "Coast Guard command to stop" },
      { term: "Seamanship", def: "The art and skill of operating a vessel safely" },
      { term: "SAR", def: "Search and Rescue - a primary Coast Guard mission" },
      { term: "Pass in Review", def: "Coast Guard graduation parade ceremony" },
      { term: "Liberty", def: "Authorized time off base" },
      { term: "Semper Paratus", def: "Coast Guard motto meaning Always Ready" },
    ],
    weeklyEvents: [
      { week: 1, title: "Arrival Week", events: [
        { name: "Arrival at TRACEN Cape May", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "In-processing and screenings", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Uniform and gear issue", url: "https://www.gocoastguard.com/get-started/basic-training" },
        { name: "Company assignment", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Initial strength test", url: "https://www.gocoastguard.com/get-started/basic-training" },
      ]},
      { week: 2, title: "Week 1 - Foundations", events: [
        { name: "Coast Guard core values instruction", url: "https://www.gocoastguard.com/get-started/basic-training" },
        { name: "Close order drill begins", url: "https://www.gocoastguard.com/get-started/basic-training" },
        { name: "Physical training program starts", url: "https://www.gocoastguard.com/get-started/basic-training" },
        { name: "Seamanship basics introduction", url: "https://www.gocoastguard.com/get-started/basic-training" },
      ]},
      { week: 3, title: "Week 2 - Core Skills", events: [
        { name: "First aid and CPR training", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
        { name: "Firefighting fundamentals", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Damage control basics", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Swimming qualification begins", url: "https://www.gocoastguard.com/get-started/basic-training" },
      ]},
      { week: 4, title: "Week 3 - Maritime Training", events: [
        { name: "Advanced seamanship", url: "https://www.gocoastguard.com/get-started/basic-training" },
        { name: "Navigation fundamentals", url: "https://www.gocoastguard.com/get-started/basic-training" },
        { name: "Search and rescue overview", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Weapons familiarization", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
      ]},
      { week: 5, title: "Week 4 - Law Enforcement", events: [
        { name: "Maritime law enforcement training", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Use of force instruction", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Boarding team procedures", url: "https://www.gocoastguard.com/get-started/basic-training" },
        { name: "Physical fitness advancement", url: "https://www.gocoastguard.com/get-started/basic-training" },
      ]},
      { week: 6, title: "Week 5 - Tactical Operations", events: [
        { name: "Tactical training evolutions", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Team leadership challenges", url: "https://www.gocoastguard.com/get-started/basic-training" },
        { name: "Advanced firefighting", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "PRT practice", url: "https://www.gocoastguard.com/get-started/basic-training" },
      ]},
      { week: 7, title: "Week 6 - Final Training", events: [
        { name: "Culminating training exercises", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Final PRT evaluation", url: "https://www.gocoastguard.com/get-started/basic-training" },
        { name: "Inspection preparations", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Family notification window", url: "https://www.militaryonesource.mil/resources/millife-guides/" },
      ]},
      { week: 8, title: "Graduation Week", events: [
        { name: "Final inspections", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Pass in Review ceremony", url: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/Training-Center-Cape-May/" },
        { name: "Liberty granted", url: "https://www.gocoastguard.com/get-started/basic-training" },
        { name: "Orders to A-School issued", url: "https://www.gocoastguard.com/get-started/basic-training" },
      ]},
    ],
  },
};

const LETTER_TEMPLATES = [
  { id: "week1", title: "First Week Check-In", category: "Early Training",
    body: `Dear [Recruit Name],\n\nWe're thinking of you every single moment. By now you've arrived and everything is new and overwhelming — that's okay. We are so proud of you for taking this step.\n\nHome is here whenever you need it in your heart. Write when you can. We love you.\n\nWith all our love,\n[Your Name]` },
  { id: "encouragement", title: "You've Got This", category: "Encouragement",
    body: `Dear [Recruit Name],\n\nThere may be moments where you wonder if you can do this. You can. You are stronger than you know, and we have never been more proud.\n\nKeep going. One day at a time. We are counting down right alongside you.\n\nForever in your corner,\n[Your Name]` },
  { id: "news", title: "News from Home", category: "Stay Connected",
    body: `Dear [Recruit Name],\n\nLife at home keeps moving, but it's not quite the same without you. Here's what's been happening...\n\n[Write your personal news here]\n\nWe miss you more than words can say. Keep being amazing.\n\nAll our love,\n[Your Name]` },
  { id: "midpoint", title: "Halfway There", category: "Milestone",
    body: `Dear [Recruit Name],\n\nCan you believe it? You're past the halfway point. The finish line is getting closer every single day.\n\nYou've already done so much. The hardest part is behind you. We can't wait to see you at graduation.\n\nSo proud of you,\n[Your Name]` },
  { id: "graduation", title: "We'll Be There", category: "Graduation",
    body: `Dear [Recruit Name],\n\nGraduation is close. We have our plans made, our bags ready, and our hearts full. We will be there cheering louder than anyone in that crowd.\n\nYou did it. You really did it.\n\nWith overwhelming pride,\n[Your Name]` },
];

const QUOTES = [
  { quote: "The price of freedom is eternal vigilance.", author: "Thomas Jefferson" },
  { quote: "Behind every strong soldier is an even stronger family.", author: "Military Families" },
  { quote: "Distance means so little when someone means so much.", author: "Tom McNeal" },
  { quote: "Courage is not the absence of fear, but the judgment that something else is more important.", author: "Ambrose Redmoon" },
  { quote: "They are not just fighting for their country - they are fighting for you.", author: "Unknown" },
  { quote: "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.", author: "Rikki Rogers" },
  { quote: "Waiting is the hardest part - but every day brings you closer.", author: "Military Families" },
  { quote: "Pride is the hardest emotion to explain and the easiest to feel.", author: "Military Families" },
  { quote: "You don't have to be in uniform to serve with honor.", author: "Unknown" },
  { quote: "The soldier above all prays for peace, for it is the soldier who bears the deepest wounds of war.", author: "Douglas MacArthur" },
  { quote: "Service to others is the rent you pay for your room here on Earth.", author: "Muhammad Ali" },
  { quote: "A hero is someone who has given their life to something bigger than themselves.", author: "Joseph Campbell" },
  { quote: "Every day of waiting is a day closer to the proudest moment of your life.", author: "Military Families" },
  { quote: "Home is where the heart is, and our hearts are with our heroes.", author: "Unknown" },
];

const LS_KEY = "btc_v3";
const getDaysBetween = (a, b) => Math.ceil((new Date(b) - new Date(a)) / 86400000);
const getDaysUntil = d => { const n = new Date(); n.setHours(0,0,0,0); return Math.ceil((new Date(d+"T12:00:00") - n) / 86400000); };
const getCurrentWeek = sd => Math.max(1, Math.ceil(getDaysBetween(sd, new Date().toISOString().slice(0,10)) / 7));
const getTodayQuote = () => QUOTES[new Date().getDate() % QUOTES.length];
const fmtDate = d => new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

function Confetti({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const colors = ["#c8a84b","#4a7c59","#4a90d9","#8b0000","#fff","#ffd700","#ff6b6b","#6bcaff"];
    const pts = Array.from({length:150}, () => ({
      x: Math.random()*canvas.width, y: Math.random()*-canvas.height,
      r: Math.random()*7+3, d: Math.random()*150,
      color: colors[Math.floor(Math.random()*colors.length)],
      tilt: 0, tiltAngle: 0, tiltSpeed: Math.random()*0.1+0.05, speed: Math.random()*3+1,
    }));
    let angle = 0, raf;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      angle += 0.01;
      pts.forEach(p => {
        p.tiltAngle += p.tiltSpeed; p.y += p.speed;
        p.x += Math.sin(angle+p.d)*1.5; p.tilt = Math.sin(p.tiltAngle)*12;
        if (p.y > canvas.height+20) { p.y = -10; p.x = Math.random()*canvas.width; }
        ctx.beginPath(); ctx.lineWidth = p.r; ctx.strokeStyle = p.color;
        ctx.moveTo(p.x+p.tilt+p.r/4, p.y); ctx.lineTo(p.x+p.tilt, p.y+p.tilt+p.r/4); ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const t = setTimeout(() => { cancelAnimationFrame(raf); ctx.clearRect(0,0,canvas.width,canvas.height); }, 6000);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [active]);
  if (!active) return null;
  return <canvas ref={ref} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:999}} />;
}

function GraduationCelebration({ profile, branch, onDismiss }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 100); return () => clearTimeout(t); }, []);
  const col = branch.color, acc = branch.accent;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <Confetti active={show} />
      <style>{`@keyframes celebIn{from{transform:scale(0.4) rotate(-8deg);opacity:0}to{transform:scale(1) rotate(0deg);opacity:1}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
      <div style={{background:`linear-gradient(135deg,${branch.dark},#050505)`,border:`2px solid ${acc}`,borderRadius:"20px",padding:"2rem 1.5rem",maxWidth:"400px",width:"100%",textAlign:"center",animation:"celebIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
        <div style={{fontSize:"4rem",marginBottom:"0.5rem",animation:"float 2s ease-in-out infinite"}}>🎓</div>
        <h1 style={{color:acc,fontSize:"2rem",margin:"0 0 0.4rem",fontFamily:"Georgia,serif"}}>CONGRATULATIONS!</h1>
        <p style={{color:"#fff",fontSize:"1.15rem",margin:"0 0 0.2rem",fontFamily:"Georgia,serif"}}>{profile.recruiterName}</p>
        <p style={{color:"#8a9bb0",fontFamily:"Georgia,serif",fontSize:"0.88rem",margin:"0 0 1.2rem"}}>has completed {branch.trainingName}</p>
        <div style={{background:`${col}25`,borderRadius:"12px",padding:"1rem",marginBottom:"1.2rem"}}>
          <p style={{color:acc,fontStyle:"italic",fontFamily:"Georgia,serif",margin:0,fontSize:"0.95rem"}}>{branch.motto}</p>
        </div>
        <p style={{color:"#a0b0c0",fontFamily:"Georgia,serif",fontSize:"0.85rem",lineHeight:"1.6",marginBottom:"1.5rem"}}>Today marks the beginning of an incredible journey. Your family couldn't be more proud.</p>
        <button onClick={onDismiss} style={{padding:"0.9rem 2rem",borderRadius:"10px",background:acc,border:"none",color:"#000",fontWeight:"700",fontSize:"1rem",cursor:"pointer"}}>Continue →</button>
      </div>
    </div>
  );
}

function NotificationPanel({ branch, profile, onClose }) {
  const [perm, setPerm] = useState(typeof Notification !== "undefined" ? Notification.permission : "default");
  const [schedule, setSchedule] = useState(() => { try { return JSON.parse(localStorage.getItem("btc_notif")||"{}"); } catch(e) { return {}; } });
  const [saved, setSaved] = useState(false);
  const col = branch.color, acc = branch.accent;
  const requestPerm = async () => {
    if (typeof Notification === "undefined") return;
    const r = await Notification.requestPermission();
    setPerm(r);
    if (r === "granted") new Notification("Basic Training Companion", { body: `Daily support for ${profile.recruiterName}'s family.` });
  };
  const toggle = k => setSchedule(s => ({ ...s, [k]: !s[k] }));
  const save = () => { localStorage.setItem("btc_notif", JSON.stringify(schedule)); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const cs = { background:"rgba(255,255,255,0.05)", borderRadius:"12px", padding:"1rem", marginBottom:"0.7rem", border:"1px solid rgba(255,255,255,0.08)" };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:900,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div style={{background:branch.dark,borderRadius:"20px 20px 0 0",padding:"1.5rem 1.25rem",maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.1rem"}}>
          <h2 style={{color:acc,fontSize:"1.1rem",margin:0}}>Notification Settings</h2>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#6a7d90",fontSize:"1.4rem",cursor:"pointer"}}>×</button>
        </div>
        <div style={{...cs,background:perm==="granted"?`${col}20`:"rgba(255,80,80,0.1)",border:`1px solid ${perm==="granted"?col:"rgba(255,80,80,0.3)"}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <p style={{color:perm==="granted"?acc:"#ff8080",fontSize:"0.85rem",fontWeight:"700",margin:"0 0 0.2rem"}}>{perm==="granted"?"✓ Notifications Enabled":"Notifications Disabled"}</p>
              <p style={{color:"#8a9bb0",fontSize:"0.78rem",margin:0}}>{perm==="granted"?"Daily support notifications active":"Enable to receive reminders and updates"}</p>
            </div>
            {perm!=="granted"&&perm!=="denied"&&<button onClick={requestPerm} style={{padding:"0.5rem 1rem",borderRadius:"8px",background:acc,border:"none",color:"#000",fontWeight:"700",fontSize:"0.8rem",cursor:"pointer"}}>Enable</button>}
          </div>
        </div>
        <div style={{...cs,background:`${col}10`,borderColor:`${col}30`}}>
          <p style={{color:acc,fontSize:"0.72rem",fontWeight:"700",margin:"0 0 0.4rem",textTransform:"uppercase",letterSpacing:"0.1em"}}>Mobile Note</p>
          <p style={{color:"#7a8d9e",fontSize:"0.8rem",lineHeight:"1.5",margin:0}}>Full mobile push notifications available in the app version. Web notifications work when the browser is open.</p>
        </div>
        <p style={{color:"#6a7d90",fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0.5rem 0"}}>Notification Schedule</p>
        {[
          {k:"dailyQuote",label:"Daily Motivational Quote",desc:"New quote every morning at 8am",icon:"💬"},
          {k:"weeklyPreview",label:"Weekly Training Preview",desc:"What your recruit is doing this week",icon:"📋"},
          {k:"letterReminder",label:"Letter Reminder",desc:"Every Tuesday - reminder to send a letter",icon:"✉️"},
          {k:"gradCountdown",label:"Graduation Milestones",desc:"Alerts at 30, 14, 7, and 1 days out",icon:"🎓"},
        ].map(item => (
          <div key={item.k} style={{...cs,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:"0.7rem",alignItems:"flex-start",flex:1}}>
              <span style={{fontSize:"1.1rem"}}>{item.icon}</span>
              <div><p style={{margin:"0 0 0.15rem",color:"#d0dce8",fontSize:"0.88rem"}}>{item.label}</p><p style={{margin:0,color:"#6a7d90",fontSize:"0.75rem"}}>{item.desc}</p></div>
            </div>
            <button onClick={() => toggle(item.k)} style={{width:"42px",height:"22px",borderRadius:"11px",background:schedule[item.k]?acc:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0,marginLeft:"0.75rem"}}>
              <div style={{width:"16px",height:"16px",borderRadius:"50%",background:"#fff",position:"absolute",top:"3px",transition:"left 0.2s",left:schedule[item.k]?"23px":"3px"}} />
            </button>
          </div>
        ))}
        <button onClick={save} style={{width:"100%",padding:"0.85rem",borderRadius:"10px",background:acc,border:"none",color:"#000",fontWeight:"700",fontSize:"0.95rem",cursor:"pointer",marginTop:"0.5rem"}}>{saved?"✓ Saved!":"Save Settings"}</button>
      </div>
    </div>
  );
}

function PaywallScreen({ branch, onUnlock }) {
  const [plan, setPlan] = useState("lifetime");
  const [loading, setLoading] = useState(false);
  const [promo, setPromo] = useState("");
  const [promoOk, setPromoOk] = useState(false);
  const col = branch.color, acc = branch.accent;
  const PLANS = [
    { id:"lifetime", label:"Lifetime Access", price:promoOk?"$9.99":"$14.99", period:"one-time", badge:"BEST VALUE",
      features:["Unlimited journal entries","Photo uploads","All 5 letter templates","Daily quotes & countdown","All branches unlocked"] },
    { id:"monthly", label:"Monthly", price:promoOk?"$2.99":"$4.99", period:"per month",
      features:["Full app access during training","Journal + photo uploads","Letter templates","Cancel anytime"] },
  ];
  const STRIPE_LINKS = {
    lifetime: "https://buy.stripe.com/14A7sDayF6h31o4gBrbII00",
    monthly: "https://buy.stripe.com/bJeeV5ayF20NeaQclbbII01",
  };
  const checkout = () => {
    setLoading(true);
    localStorage.setItem("btc_pending_plan", plan);
    window.location.href = STRIPE_LINKS[plan];
  };
  const applyPromo = () => {
    if (["MILITARY10","FAMILY10","BOOTS2024"].includes(promo.toUpperCase())) setPromoOk(true);
    else alert("Invalid promo code. Try MILITARY10 for a discount.");
  };
  const selectedPlan = PLANS.find(p => p.id === plan);
  return (
    <div style={{minHeight:"100vh",background:branch.dark,fontFamily:"Georgia,serif",padding:"1.5rem 1.25rem",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <style>{`@keyframes pulse2{0%,100%{box-shadow:0 0 0 0 ${acc}44}50%{box-shadow:0 0 0 12px transparent}}`}</style>
      <div style={{maxWidth:"460px",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:"1.75rem"}}>
          <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>⭐</div>
          <h1 style={{color:"#fff",fontSize:"1.6rem",margin:"0 0 0.4rem"}}>Unlock Full Access</h1>
          <p style={{color:"#8a9bb0",margin:0,fontSize:"0.9rem"}}>Support {branch.name} families through every step</p>
          <div style={{width:"50px",height:"2px",background:acc,margin:"1rem auto 0"}}/>
        </div>
        <div style={{background:`${col}20`,borderRadius:"14px",padding:"1rem 1.1rem",marginBottom:"1.1rem"}}>
          <p style={{color:acc,fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.6rem"}}>What You Get</p>
          {["📅 Smart countdown tied to your recruit's exact dates","📖 Branch-specific glossary and rank guide","✉️ Pre-written letter templates","📓 Personal journal with photo uploads","🔔 Milestone notifications"].map((f,i) => (
            <p key={i} style={{color:"#c0ccd8",fontSize:"0.85rem",margin:"0 0 0.35rem"}}>{f}</p>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",marginBottom:"1.1rem"}}>
          {PLANS.map(p => (
            <div key={p.id} onClick={() => setPlan(p.id)} style={{background:plan===p.id?`${col}35`:"rgba(255,255,255,0.04)",border:`2px solid ${plan===p.id?acc:"rgba(255,255,255,0.1)"}`,borderRadius:"14px",padding:"1rem 1.1rem",cursor:"pointer",position:"relative",transition:"all 0.2s"}}>
              {p.badge&&<div style={{position:"absolute",top:"-10px",right:"12px",background:acc,color:"#000",fontSize:"0.6rem",fontWeight:"700",padding:"0.2rem 0.6rem",borderRadius:"10px",letterSpacing:"0.08em"}}>{p.badge}</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <p style={{margin:"0 0 0.3rem",color:"#fff",fontWeight:"700",fontSize:"0.95rem"}}>{p.label}</p>
                  {p.features.slice(0,3).map((f,i) => <p key={i} style={{margin:"0 0 0.12rem",color:"#8a9bb0",fontSize:"0.78rem"}}>• {f}</p>)}
                  {p.features.length>3&&<p style={{margin:"0.1rem 0 0",color:"#5a6d80",fontSize:"0.72rem"}}>+{p.features.length-3} more</p>}
                </div>
                <div style={{textAlign:"right",flexShrink:0,marginLeft:"1rem"}}>
                  <p style={{margin:0,color:acc,fontWeight:"700",fontSize:"1.3rem"}}>{p.price}</p>
                  <p style={{margin:0,color:"#6a7d90",fontSize:"0.72rem"}}>{p.period}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.1rem"}}>
          <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Promo code" style={{flex:1,padding:"0.62rem 0.85rem",borderRadius:"8px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",fontSize:"0.88rem"}} />
          <button onClick={applyPromo} style={{padding:"0.62rem 1rem",borderRadius:"8px",background:`${col}40`,border:`1px solid ${col}`,color:acc,fontWeight:"700",fontSize:"0.82rem",cursor:"pointer"}}>Apply</button>
        </div>
        <button onClick={checkout} disabled={loading} style={{width:"100%",padding:"1rem",borderRadius:"12px",background:acc,border:"none",color:"#000",fontWeight:"700",fontSize:"1.05rem",cursor:loading?"not-allowed":"pointer",animation:"pulse2 2s infinite",opacity:loading?0.7:1}}>{loading?"Redirecting...":"Continue to Checkout →"}</button>
        <div style={{display:"flex",justifyContent:"center",gap:"1.25rem",marginTop:"0.85rem"}}>
          {["🔒 Secure checkout","💳 Stripe payments","↩ 7-day refund"].map((t,i) => <span key={i} style={{color:"#4a5d70",fontSize:"0.72rem"}}>{t}</span>)}
        </div>
        <p style={{color:"#2a3d50",fontSize:"0.72rem",textAlign:"center",marginTop:"0.75rem",margin:"0.75rem 0 0"}}>By continuing you agree to our terms of service</p>
      </div>
    </div>
  );
}

function LetterTemplates({ branch, profile }) {
  const [sel, setSel] = useState(null);
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);
  const col = branch.color, acc = branch.accent;
  const cs = { background:"rgba(255,255,255,0.05)", borderRadius:"12px", padding:"0.9rem 1rem", marginBottom:"0.65rem", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" };
  const open = t => {
    const filled = t.body.replace(/\[Recruit Name\]/g, profile.recruiterName).replace(/\[Your Name\]/g, profile.familyName);
    setBody(filled); setSel(t);
  };
  const copy = () => { navigator.clipboard.writeText(body).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  const download = () => { const a = document.createElement("a"); a.href = "data:text/plain;charset=utf-8,"+encodeURIComponent(body); a.download = `${sel.title}.txt`; a.click(); };
  if (sel) return (
    <div style={{fontFamily:"Georgia,serif"}}>
      <button onClick={() => setSel(null)} style={{background:"transparent",border:"none",color:acc,cursor:"pointer",marginBottom:"0.75rem",fontSize:"0.88rem"}}>← Back to templates</button>
      <h3 style={{color:"#fff",margin:"0 0 0.2rem"}}>{sel.title}</h3>
      <p style={{color:"#6a7d90",fontSize:"0.78rem",marginBottom:"0.85rem"}}>Pre-filled for {profile.recruiterName} — edit as needed</p>
      <textarea value={body} onChange={e => setBody(e.target.value)} rows={17} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",color:"#d0dce8",padding:"0.85rem",fontSize:"0.88rem",lineHeight:"1.65",resize:"vertical",boxSizing:"border-box"}} />
      <div style={{display:"flex",gap:"0.65rem",marginTop:"0.65rem"}}>
        <button onClick={copy} style={{flex:1,padding:"0.7rem",borderRadius:"8px",background:acc,border:"none",color:"#000",fontWeight:"700",cursor:"pointer"}}>{copied?"✓ Copied!":"Copy to Clipboard"}</button>
        <button onClick={download} style={{padding:"0.7rem 1rem",borderRadius:"8px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#d0dce8",cursor:"pointer"}}>Download</button>
      </div>
    </div>
  );
  const cats = [...new Set(LETTER_TEMPLATES.map(t => t.category))];
  return (
    <div style={{fontFamily:"Georgia,serif"}}>
      <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"0.4rem"}}>Letter Templates</h2>
      <p style={{color:"#6a7d90",fontSize:"0.85rem",marginBottom:"1.25rem"}}>Pre-written and personalized for {profile.recruiterName}</p>
      {cats.map(cat => (
        <div key={cat}>
          <p style={{color:"#6a7d90",fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0.5rem 0 0.4rem"}}>{cat}</p>
          {LETTER_TEMPLATES.filter(t => t.category===cat).map(t => (
            <div key={t.id} onClick={() => open(t)} style={cs}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{margin:"0 0 0.2rem",color:"#d0dce8",fontWeight:"700",fontSize:"0.9rem"}}>{t.title}</p>
                  <p style={{margin:0,color:"#6a7d90",fontSize:"0.78rem"}}>{t.body.replace(/\n/g," ").slice(0,60)}…</p>
                </div>
                <span style={{color:acc,marginLeft:"0.75rem",fontSize:"1.1rem"}}>→</span>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{background:`${col}12`,borderRadius:"10px",padding:"0.9rem",border:`1px solid ${col}25`,marginTop:"0.5rem"}}>
        <p style={{color:acc,fontSize:"0.78rem",fontWeight:"700",margin:"0 0 0.5rem"}}>Letter Tips</p>
        {["Write at least once a week – it truly means the world","Keep letters positive and encouraging","Share small details from home — they miss normalcy","Avoid sharing stressful news during early weeks"].map((t,i) => (
          <p key={i} style={{color:"#8a9bb0",fontSize:"0.81rem",margin:"0 0 0.25rem"}}>• {t}</p>
        ))}
      </div>
    </div>
  );
}

function BranchSelector({ onSelect }) {
  const [hov, setHov] = useState(null);
  return (
    <div style={{minHeight:"100vh",background:"#0a0f1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"1.5rem 1.25rem"}}>
      <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
        <div style={{fontSize:"3rem",marginBottom:"0.5rem"}}>⭐</div>
        <h1 style={{color:"#fff",fontSize:"clamp(1.7rem,4vw,2.7rem)",fontWeight:"700",letterSpacing:"0.04em",margin:0}}>Basic Training Companion</h1>
        <p style={{color:"#8a9bb0",fontSize:"0.95rem",marginTop:"0.6rem",fontStyle:"italic"}}>For the families waiting at home</p>
        <div style={{width:"60px",height:"3px",background:"linear-gradient(90deg,#c8a84b,#4a90d9)",margin:"1.25rem auto 0",borderRadius:"2px"}}/>
      </div>
      <p style={{color:"#6a7d90",marginBottom:"1.25rem",fontSize:"0.9rem",textAlign:"center"}}>Select your recruit's branch</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1rem",maxWidth:"520px",width:"100%"}}>
        {Object.entries(BRANCHES).filter(([k]) => k !== "coastguard").map(([k,b]) => (
          <button key={k} onMouseEnter={() => setHov(k)} onMouseLeave={() => setHov(null)} onClick={() => onSelect(k)}
            style={{background:hov===k?`${b.color}40`:"rgba(255,255,255,0.04)",border:`2px solid ${hov===k?b.accent:"rgba(255,255,255,0.1)"}`,borderRadius:"14px",padding:"1.25rem 1rem",cursor:"pointer",color:"#fff",transition:"all 0.2s",textAlign:"center"}}>
            <div style={{fontSize:"1.9rem",marginBottom:"0.45rem"}}>{k==="army"?"🪖":k==="airforce"?"✈️":k==="navy"?"⚓":"🦅"}</div>
            <div style={{fontSize:"1rem",fontWeight:"700",letterSpacing:"0.04em"}}>{b.name}</div>
            <div style={{fontSize:"0.7rem",color:hov===k?"rgba(255,255,255,0.75)":"#6a7d90",marginTop:"0.25rem"}}>{b.duration} weeks</div>
          </button>
        ))}
      </div>
      <div style={{maxWidth:"520px",width:"100%",marginTop:"1rem"}}>
        {(([k,b]) => (
          <button key={k} onMouseEnter={() => setHov(k)} onMouseLeave={() => setHov(null)} onClick={() => onSelect(k)}
            style={{width:"100%",background:hov===k?`${b.color}40`:"rgba(255,255,255,0.04)",border:`2px solid ${hov===k?b.accent:"rgba(255,255,255,0.1)"}`,borderRadius:"14px",padding:"1.25rem 1rem",cursor:"pointer",color:"#fff",transition:"all 0.2s",textAlign:"center"}}>
            <div style={{fontSize:"1.9rem",marginBottom:"0.45rem"}}>🔱</div>
            <div style={{fontSize:"1rem",fontWeight:"700",letterSpacing:"0.04em"}}>{b.name}</div>
            <div style={{fontSize:"0.7rem",color:hov===k?"rgba(255,255,255,0.75)":"#6a7d90",marginTop:"0.25rem"}}>{b.duration} weeks</div>
          </button>
        ))(Object.entries(BRANCHES).find(([k]) => k === "coastguard"))}
      </div>
    </div>
  );
}

function SetupScreen({ branch, onComplete }) {
  const [form, setForm] = useState({recruiterName:"",familyName:"",startDate:"",endDate:""});
  const [err, setErr] = useState("");
  const s = (k,v) => setForm(f => ({...f,[k]:v}));
  const inp = {width:"100%",padding:"0.82rem 1rem",borderRadius:"8px",border:`1px solid ${branch.color}60`,background:"rgba(255,255,255,0.06)",color:"#fff",fontSize:"0.92rem",boxSizing:"border-box"};
  const lbl = {color:branch.accent,fontSize:"0.75rem",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem"};
  const submit = () => {
    if (!form.recruiterName||!form.familyName||!form.startDate||!form.endDate) { setErr("Please fill in all fields."); return; }
    if (new Date(form.endDate)<=new Date(form.startDate)) { setErr("End date must be after start date."); return; }
    onComplete(form);
  };
  return (
    <div style={{minHeight:"100vh",background:branch.dark,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"1.5rem 1.25rem"}}>
      <div style={{maxWidth:"440px",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:"1.75rem"}}>
          <h2 style={{color:"#fff",fontSize:"1.7rem",margin:0}}>{branch.fullName}</h2>
          <p style={{color:branch.accent,fontStyle:"italic",margin:"0.4rem 0"}}>{branch.motto}</p>
          <div style={{width:"45px",height:"2px",background:branch.accent,margin:"0.85rem auto"}}/>
          <p style={{color:"#8a9bb0",margin:0,fontSize:"0.9rem"}}>Let's personalize your companion</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <div><label style={lbl}>Recruit's Name</label><input style={inp} placeholder="e.g. Alex Johnson" value={form.recruiterName} onChange={e => s("recruiterName",e.target.value)} /></div>
          <div><label style={lbl}>Your Name (Family Member)</label><input style={inp} placeholder="e.g. Mom, Dad, Sarah" value={form.familyName} onChange={e => s("familyName",e.target.value)} /></div>
          <div><label style={lbl}>Training Start Date</label><input type="date" style={inp} value={form.startDate} onChange={e => s("startDate",e.target.value)} /></div>
          <div><label style={lbl}>Anticipated Graduation Date</label><input type="date" style={inp} value={form.endDate} onChange={e => s("endDate",e.target.value)} /></div>
          {err&&<p style={{color:"#ff6b6b",fontSize:"0.88rem",textAlign:"center",margin:0}}>{err}</p>}
          <button onClick={submit} style={{padding:"0.95rem",borderRadius:"10px",background:branch.accent,border:"none",color:"#000",fontWeight:"700",fontSize:"1rem",cursor:"pointer"}}>Continue →</button>
          <button onClick={() => onComplete(null)} style={{background:"transparent",border:"none",color:"#5a6d80",fontSize:"0.85rem",cursor:"pointer",padding:"0.5rem"}}>← Back to branch selection</button>
        </div>
      </div>
    </div>
  );
}

function Ring({ days, total, accent }) {
  const r=70, c=2*Math.PI*r, p=Math.max(0,Math.min(1,1-Math.max(0,days)/Math.max(1,total)));
  return (
    <svg width="170" height="170" viewBox="0 0 170 170">
      <circle cx="85" cy="85" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
      <circle cx="85" cy="85" r={r} fill="none" stroke={accent} strokeWidth="10" strokeDasharray={c} strokeDashoffset={c*(1-p)} strokeLinecap="round" transform="rotate(-90 85 85)" style={{transition:"stroke-dashoffset 1s ease"}} />
      <text x="85" y="78" textAnchor="middle" fill="#fff" fontSize="32" fontWeight="700" fontFamily="Georgia,serif">{Math.max(0,days)}</text>
      <text x="85" y="100" textAnchor="middle" fill={accent} fontSize="11" fontFamily="Georgia,serif">days remaining</text>
    </svg>
  );
}

function Dashboard({ branchKey, branch, profile, onReset }) {
  const [tab, setTab] = useState("home");
  const [memories, setMemories] = useState([]);
  const [newMem, setNewMem] = useState({type:"feeling",text:"",photoPreview:null,photoName:null});
  const [reminders, setReminders] = useState([
    {id:1,text:"Send your first letter this week!",done:false},
    {id:2,text:"Write down your feelings today",done:false},
    {id:3,text:"Connect with another military family",done:false},
    {id:4,text:"Prepare graduation weekend travel plans",done:false},
  ]);
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [showCeleb, setShowCeleb] = useState(false);
  const [celebDone, setCelebDone] = useState(false);
  const [newRemText, setNewRemText] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(LS_KEY)||"{}");
      if (d.memories) setMemories(d.memories);
      if (d.reminders) setReminders(d.reminders);
      if (d.celebDone) setCelebDone(true);
    } catch(e) {}
  }, []);

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(LS_KEY)||"{}");
      localStorage.setItem(LS_KEY, JSON.stringify({...existing, memories, reminders, celebDone}));
    } catch(e) {}
  }, [memories, reminders, celebDone]);

  const col=branch.color, acc=branch.accent;
  const daysStart=getDaysUntil(profile.startDate);
  const daysEnd=getDaysUntil(profile.endDate);
  const totalDays=getDaysBetween(profile.startDate, profile.endDate);
  const started=daysStart<=0;
  const complete=daysEnd<0;
  const curWeek=started&&!complete?getCurrentWeek(profile.startDate):1;
  const thisWeek=branch.weeklyEvents.find(w => w.week===curWeek);
  const nextWeek=branch.weeklyEvents.find(w => w.week===curWeek+1);
  const quote=getTodayQuote();

  useEffect(() => { if (complete&&!celebDone) setShowCeleb(true); }, [complete, celebDone]);

  const uploadPhoto = e => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onloadend = () => setNewMem(m => ({...m, photoPreview:rd.result, photoName:f.name}));
    rd.readAsDataURL(f);
  };

  const addMemory = () => {
    if (!newMem.text.trim()&&!newMem.photoPreview) return;
    setMemories(m => [...m, {...newMem, id:Date.now(), date:new Date().toLocaleDateString()}]);
    setNewMem({type:"feeling",text:"",photoPreview:null,photoName:null});
  };

  const cs = {background:"rgba(255,255,255,0.05)",borderRadius:"13px",padding:"1rem 1.15rem",marginBottom:"0.85rem",border:"1px solid rgba(255,255,255,0.08)"};
  const TABS = [
    {id:"home",icon:"🏠",label:"Home"},{id:"timeline",icon:"📅",label:"Timeline"},
    {id:"glossary",icon:"📖",label:"Glossary"},{id:"ranks",icon:"🎖",label:"Ranks"},
    {id:"memories",icon:"📓",label:"Journal"},{id:"letters",icon:"✉️",label:"Letters"},
    {id:"reminders",icon:"🔔",label:"Reminders"},
  ];
  const filtAcr=branch.acronyms.filter(a => a.abbr.toLowerCase().includes(search.toLowerCase())||a.meaning.toLowerCase().includes(search.toLowerCase()));
  const filtTrm=branch.keyTerms.filter(t => t.term.toLowerCase().includes(search.toLowerCase())||t.def.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{minHeight:"100vh",background:branch.dark,fontFamily:"Georgia,serif",color:"#c0ccd8"}}>
      {showCeleb&&!celebDone&&(<GraduationCelebration profile={profile} branch={branch} onDismiss={() => { setShowCeleb(false); setCelebDone(true); }} />)}
      {notifOpen&&<NotificationPanel branch={branch} profile={profile} onClose={() => setNotifOpen(false)} />}
      <div style={{background:`linear-gradient(135deg,${col},${branch.dark})`,padding:"1.3rem 1.1rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <p style={{margin:0,color:acc,fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase"}}>{branch.name} · {branch.trainingName}</p>
            <h1 style={{margin:"0.2rem 0 0",fontSize:"1.3rem",fontWeight:"700"}}>{profile.recruiterName}'s Training</h1>
            <p style={{margin:"0.12rem 0 0",color:"#8a9bb0",fontSize:"0.8rem"}}>Followed by {profile.familyName}</p>
          </div>
          <div style={{display:"flex",gap:"0.45rem"}}>
            <button onClick={() => setNotifOpen(true)} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:"8px",padding:"0.5rem 0.7rem",color:"#fff",cursor:"pointer",fontSize:"1rem"}}>🔔</button>
            <button onClick={onReset} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"8px",padding:"0.5rem 0.7rem",color:"#8a9bb0",cursor:"pointer",fontSize:"0.75rem"}}>Reset</button>
          </div>
        </div>
      </div>

      <div style={{display:"flex",overflowX:"auto",borderBottom:"1px solid rgba(255,255,255,0.08)",background:"rgba(0,0,0,0.3)"}}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${tab===t.id?acc:"transparent"}`,padding:"0.7rem 0.85rem",color:tab===t.id?acc:"#6a7d90",cursor:"pointer",fontSize:"0.78rem",whiteSpace:"nowrap",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.15rem",minWidth:"60px"}}>
            <span style={{fontSize:"0.9rem"}}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{padding:"1rem 1.05rem",maxWidth:"680px",margin:"0 auto"}}>
        {tab==="home"&&(
          <div>
            <div style={{...cs,background:`linear-gradient(135deg,${col}40,rgba(0,0,0,0.3))`,textAlign:"center",padding:"1.5rem 1rem"}}>
              {complete?(
                <div>
                  <div style={{fontSize:"2.5rem"}}>🎓</div>
                  <h2 style={{color:acc,margin:"0.4rem 0"}}>Training Complete!</h2>
                  <p style={{color:"#8a9bb0",margin:"0 0 0.75rem"}}>Congratulations to {profile.recruiterName}!</p>
                  <button onClick={() => {setCelebDone(false);setShowCeleb(true);}} style={{padding:"0.6rem 1.25rem",borderRadius:"8px",background:acc,border:"none",color:"#000",fontWeight:"700",cursor:"pointer"}}>🎉 Replay Celebration</button>
                </div>
              ):started?(
                <div>
                  <p style={{color:acc,fontSize:"0.72rem",letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 0.75rem"}}>Days Until Graduation</p>
                  <Ring days={daysEnd} total={totalDays} accent={acc}/>
                  <p style={{color:"#8a9bb0",fontSize:"0.82rem",margin:"0.2rem 0 0"}}>Graduation: {fmtDate(profile.endDate)}</p>
                </div>
              ):(
                <div>
                  <p style={{color:acc,fontSize:"0.72rem",letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 0.75rem"}}>Days Until Training Begins</p>
                  <Ring days={daysStart} total={daysStart+1} accent={acc}/>
                  <p style={{color:"#8a9bb0",fontSize:"0.82rem",margin:"0.2rem 0 0"}}>Training starts: {fmtDate(profile.startDate)}</p>
                </div>
              )}
            </div>

            <div style={{...cs,borderLeft:`3px solid ${acc}`}}>
              <p style={{color:acc,fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 0.5rem"}}>Today's Quote</p>
              <p style={{color:"#d0dce8",fontStyle:"italic",fontSize:"0.95rem",lineHeight:"1.6",margin:"0 0 0.4rem"}}>"{quote.quote}"</p>
              <p style={{color:"#6a7d90",fontSize:"0.8rem",margin:0}}>— {quote.author}</p>
            </div>

            {!complete&&(()=>{
              const displayWeek = started ? thisWeek : branch.weeklyEvents[0];
              const displayNext = started ? nextWeek : branch.weeklyEvents[1];
              return (<>
                {displayWeek&&(
                  <div style={cs}>
                    <p style={{color:acc,fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 0.6rem"}}>{started?`Week ${curWeek}: `:"Preview — "}{displayWeek.title}</p>
                    {displayWeek.events.map((ev,i) => (
                      <div key={i} style={{display:"flex",gap:"0.5rem",marginBottom:"0.35rem",alignItems:"flex-start"}}>
                        <span style={{color:acc,fontSize:"0.75rem",marginTop:"2px",flexShrink:0}}>•</span>
                        {ev.url?<a href={ev.url} target="_blank" rel="noopener noreferrer" style={{color:"#c0ccd8",fontSize:"0.85rem",textDecoration:"none"}}>{ev.name}</a>:<span style={{color:"#c0ccd8",fontSize:"0.85rem"}}>{ev.name}</span>}
                      </div>
                    ))}
                  </div>
                )}
                {displayNext&&(
                  <div style={{...cs,background:"rgba(255,255,255,0.03)"}}>
                    <p style={{color:"#6a7d90",fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 0.5rem"}}>Coming Up: {displayNext.title}</p>
                    {displayNext.events.slice(0,3).map((ev,i) => (
                      <div key={i} style={{display:"flex",gap:"0.5rem",marginBottom:"0.3rem",alignItems:"flex-start"}}>
                        <span style={{color:"#6a7d90",fontSize:"0.75rem",marginTop:"2px",flexShrink:0}}>•</span>
                        {ev.url?<a href={ev.url} target="_blank" rel="noopener noreferrer" style={{color:"#8a9bb0",fontSize:"0.82rem",textDecoration:"none"}}>{ev.name}</a>:<span style={{color:"#8a9bb0",fontSize:"0.82rem"}}>{ev.name}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </>);
            })()}
            <p style={{textAlign:"center",color:`${acc}55`,fontStyle:"italic",fontSize:"0.82rem",marginTop:"0.5rem"}}>{branch.motto}</p>
          </div>
        )}

        {tab==="timeline"&&(
          <div>
            <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"1rem"}}>Training Timeline</h2>
            {branch.weeklyEvents.map((wk,i) => {
              const cur=started&&wk.week===curWeek;
              const past=started&&wk.week<curWeek;
              return (
                <div key={i} style={{display:"flex",gap:"0.8rem",marginBottom:"0.75rem"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{width:"32px",height:"32px",borderRadius:"50%",background:cur?acc:past?`${col}60`:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.72rem",fontWeight:"700",color:cur?"#000":past?"#4a7c59":"#6a7d90",flexShrink:0}}>{past?"✓":wk.week}</div>
                    {i<branch.weeklyEvents.length-1&&<div style={{width:"2px",flex:1,background:"rgba(255,255,255,0.08)",margin:"4px 0"}} />}
                  </div>
                  <div style={{...cs,flex:1,padding:"0.8rem 0.95rem",marginBottom:0,borderColor:cur?`${acc}60`:undefined}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.45rem"}}>
                      <p style={{margin:0,fontWeight:"700",color:cur?acc:past?"#4a5d70":"#d0dce8",fontSize:"0.88rem"}}>Week {wk.week}: {wk.title}</p>
                      {cur&&<span style={{background:acc,color:"#000",fontSize:"0.6rem",padding:"0.15rem 0.5rem",borderRadius:"10px",fontWeight:"700"}}>NOW</span>}
                    </div>
                    {wk.events.map((ev,j) => (
                      <div key={j} style={{color:past?"#3a4d60":"#8a9bb0",fontSize:"0.8rem",marginBottom:"0.2rem",display:"flex",gap:"0.4rem"}}>
                        <span style={{flexShrink:0}}>{past?"✓":"• "}</span>
                        {ev.url?<a href={ev.url} target="_blank" rel="noopener noreferrer" style={{color:past?"#3a4d60":"#8a9bb0",textDecoration:"none"}}>{ev.name}</a>:<span>{ev.name}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="glossary"&&(
          <div>
            <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"0.8rem"}}>Glossary</h2>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search acronyms and terms..." style={{width:"100%",padding:"0.7rem 0.95rem",borderRadius:"10px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"#fff",fontSize:"0.88rem",marginBottom:"1rem",boxSizing:"border-box"}} />
            {filtAcr.length>0&&<div style={{marginBottom:"1.1rem"}}>
              <p style={{color:"#6a7d90",fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 0.5rem"}}>Acronyms</p>
              {filtAcr.map((a,i) => <div key={i} style={{...cs,padding:"0.65rem 0.95rem",display:"flex",gap:"0.75rem",alignItems:"flex-start",marginBottom:"0.45rem"}}><span style={{color:acc,fontWeight:"700",fontSize:"0.88rem",flexShrink:0,minWidth:"60px"}}>{a.abbr}</span><span style={{color:"#c0ccd8",fontSize:"0.85rem"}}>{a.meaning}</span></div>)}
            </div>}
            {filtTrm.length>0&&<div>
              <p style={{color:"#6a7d90",fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 0.5rem"}}>Key Terms</p>
              {filtTrm.map((t,i) => <div key={i} style={{...cs,marginBottom:"0.6rem"}}><p style={{margin:"0 0 0.25rem",color:acc,fontWeight:"700",fontSize:"0.88rem"}}>{t.term}</p><p style={{margin:0,color:"#c0ccd8",fontSize:"0.83rem",lineHeight:"1.5"}}>{t.def}</p></div>)}
            </div>}
            {filtAcr.length===0&&filtTrm.length===0&&<p style={{color:"#6a7d90",textAlign:"center",fontStyle:"italic"}}>No results found.</p>}
          </div>
        )}

        {tab==="ranks"&&(
          <div>
            <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"1rem"}}>Enlisted Ranks</h2>
            {branch.ranks.map((r,i) => (
              <div key={i} style={{...cs,display:"flex",alignItems:"center",gap:"0.85rem",padding:"0.7rem 0.95rem",marginBottom:"0.5rem"}}>
                <div style={{width:"42px",height:"42px",borderRadius:"8px",background:`${col}30`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{color:acc,fontSize:"0.65rem",fontWeight:"700"}}>{r.grade}</span>
                </div>
                <div><p style={{margin:"0 0 0.12rem",fontWeight:"700",color:"#d0dce8",fontSize:"0.9rem"}}>{r.name}</p><p style={{margin:0,color:"#6a7d90",fontSize:"0.78rem"}}>{r.abbr}</p></div>
              </div>
            ))}
          </div>
        )}

        {tab==="memories"&&(
          <div>
            <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"0.7rem"}}>Journal</h2>
            <div style={cs}>
              <p style={{color:"#6a7d90",fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 0.5rem"}}>New Entry</p>
              <div style={{display:"flex",gap:"0.4rem",marginBottom:"0.6rem",flexWrap:"wrap"}}>
                {[{id:"feeling",label:"Feeling"},{id:"call",label:"Call"},{id:"photo",label:"Photo"}].map(t => (
                  <button key={t.id} onClick={() => setNewMem(m => ({...m,type:t.id}))} style={{padding:"0.3rem 0.75rem",borderRadius:"20px",border:`1px solid ${newMem.type===t.id?acc:"rgba(255,255,255,0.15)"}`,background:newMem.type===t.id?`${col}40`:"transparent",color:newMem.type===t.id?acc:"#8a9bb0",cursor:"pointer",fontSize:"0.8rem"}}>
                    {t.id==="feeling"?"😊":t.id==="call"?"📞":"📷"} {t.label}
                  </button>
                ))}
              </div>
              <textarea value={newMem.text} onChange={e => setNewMem(m => ({...m,text:e.target.value}))} placeholder="Write your thoughts, feelings, or memories..." rows={4} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",color:"#d0dce8",padding:"0.7rem",fontSize:"0.85rem",resize:"vertical",boxSizing:"border-box"}} />
              <input type="file" accept="image/*" ref={fileRef} onChange={uploadPhoto} style={{display:"none"}} />
              <button onClick={() => fileRef.current.click()} style={{marginTop:"0.55rem",width:"100%",padding:"0.55rem",borderRadius:"8px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"#8a9bb0",cursor:"pointer",fontSize:"0.82rem"}}>📷 Add Photo</button>
              {newMem.photoPreview&&(
                <div style={{marginTop:"0.5rem",position:"relative"}}>
                  <img src={newMem.photoPreview} alt="preview" style={{width:"100%",maxHeight:"200px",objectFit:"cover",borderRadius:"8px"}} />
                  <button onClick={() => setNewMem(m => ({...m,photoPreview:null,photoName:null}))} style={{position:"absolute",top:"0.4rem",right:"0.4rem",background:"rgba(0,0,0,0.7)",border:"none",color:"#fff",borderRadius:"50%",width:"24px",height:"24px",cursor:"pointer",fontSize:"0.8rem"}}>×</button>
                </div>
              )}
              <button onClick={addMemory} style={{marginTop:"0.62rem",padding:"0.58rem 1.15rem",borderRadius:"8px",background:acc,border:"none",color:"#000",fontWeight:"700",cursor:"pointer",fontSize:"0.88rem"}}>Save Entry</button>
            </div>
            {memories.length===0?<p style={{color:"#5a6d80",textAlign:"center",fontStyle:"italic",fontSize:"0.88rem"}}>No journal entries yet. Start capturing this journey.</p>:<>
              <p style={{color:"#6a7d90",fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 0.6rem"}}>Past Entries</p>
              {[...memories].reverse().map(entry => (
                <div key={entry.id} style={{background:"rgba(255,255,255,0.05)",borderRadius:"12px",padding:"0.9rem",marginBottom:"0.65rem",border:"1px solid rgba(255,255,255,0.07)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:"0.45rem",alignItems:"center",marginBottom:"0.4rem"}}>
                        <span>{entry.type==="feeling"?"😊":entry.type==="call"?"📞":"📷"}</span>
                        <span style={{color:acc,fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>{entry.type}</span>
                        <span style={{color:"#4a5d70",fontSize:"0.72rem"}}>· {entry.date}</span>
                      </div>
                      {entry.text&&<p style={{color:"#d0dce8",margin:"0 0 0.45rem",fontSize:"0.85rem",lineHeight:"1.55"}}>{entry.text}</p>}
                      {entry.photoPreview&&<img src={entry.photoPreview} alt="memory" style={{width:"100%",maxHeight:"200px",objectFit:"cover",borderRadius:"8px"}} />}
                    </div>
                    <button onClick={() => setMemories(m => m.filter(e => e.id!==entry.id))} style={{background:"transparent",border:"none",color:"#4a5d70",cursor:"pointer",fontSize:"1rem",marginLeft:"0.5rem"}}>×</button>
                  </div>
                </div>
              ))}
            </>}
          </div>
        )}

        {tab==="letters"&&<LetterTemplates branch={branch} profile={profile}/>}

        {tab==="reminders"&&(
          <div>
            <h2 style={{color:acc,fontSize:"1.05rem",letterSpacing:"0.05em",marginBottom:"0.9rem"}}>Reminders</h2>
            <div style={{...cs,display:"flex",gap:"0.5rem",padding:"0.7rem 0.85rem"}}>
              <input value={newRemText} onChange={e => setNewRemText(e.target.value)} onKeyDown={e => { if(e.key==="Enter"&&newRemText.trim()){setReminders(r=>[...r,{id:Date.now(),text:newRemText.trim(),done:false}]);setNewRemText("");}}} placeholder="Add a reminder..." style={{flex:1,background:"transparent",border:"none",color:"#d0dce8",fontSize:"0.88rem",outline:"none"}} />
              <button onClick={() => {if(newRemText.trim()){setReminders(r => [...r,{id:Date.now(),text:newRemText.trim(),done:false}]);setNewRemText("");}}} style={{background:acc,border:"none",borderRadius:"6px",color:"#000",fontWeight:"700",padding:"0.35rem 0.75rem",cursor:"pointer",fontSize:"0.82rem"}}>Add</button>
            </div>
            {reminders.map(r => (
              <div key={r.id} style={{...cs,display:"flex",alignItems:"flex-start",gap:"0.65rem",padding:"0.75rem 0.95rem"}}>
                <button onClick={() => setReminders(rs => rs.map(x => x.id===r.id?{...x,done:!x.done}:x))} style={{width:"20px",height:"20px",borderRadius:"4px",border:`2px solid ${r.done?acc:"rgba(255,255,255,0.25)"}`,background:r.done?acc:"transparent",cursor:"pointer",flexShrink:0,marginTop:"1px",display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontSize:"0.7rem"}}>{r.done?"✓":""}</button>
                <p style={{margin:0,flex:1,color:r.done?"#4a5d70":"#c0ccd8",fontSize:"0.86rem",textDecoration:r.done?"line-through":"none",lineHeight:"1.5"}}>{r.text}</p>
                <button onClick={() => setReminders(rs => rs.filter(x => x.id!==r.id))} style={{background:"transparent",border:"none",color:"#4a5d70",cursor:"pointer",fontSize:"1rem",padding:"0"}}>×</button>
              </div>
            ))}
            <div style={{...cs,background:`${col}10`,borderColor:`${col}30`,marginTop:"0.5rem"}}>
              <p style={{color:acc,fontSize:"0.76rem",fontWeight:"700",margin:"0 0 0.55rem"}}>Support Tips</p>
              {["Write at least once a week — it means everything","Keep letters positive and uplifting","Prepare travel and lodging for graduation early","Connect with other families going through the same thing"].map((t,i) => (
                <p key={i} style={{color:"#a0b0c0",fontSize:"0.8rem",margin:"0 0 0.28rem"}}>• {t}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState("loading");
  const [bKey, setBKey] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("unlocked") === "true") {
        const pendingPlan = localStorage.getItem("btc_pending_plan") || "lifetime";
        localStorage.setItem("btc_paid", JSON.stringify({ plan: pendingPlan, ts: Date.now() }));
        localStorage.removeItem("btc_pending_plan");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      const d = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      const paid = localStorage.getItem("btc_paid") ? true : false;
      if (d.branchKey && d.profile) {
        setBKey(d.branchKey);
        setProfile(d.profile);
        setStage(paid ? "dashboard" : "paywall");
        return;
      }
    } catch(e) {}
    setStage("branch");
  }, []);

  useEffect(() => {
    if (bKey && profile) {
      try {
        const existing = JSON.parse(localStorage.getItem(LS_KEY)||"{}");
        localStorage.setItem(LS_KEY, JSON.stringify({...existing, branchKey:bKey, profile}));
      } catch(e) {}
    }
  }, [bKey, profile]);

  const selectBranch = k => { setBKey(k); setStage("setup"); };
  const completeSetup = data => {
    if (!data) { setStage("branch"); setBKey(null); return; }
    setProfile(data);
    setStage(localStorage.getItem("btc_paid") ? "dashboard" : "paywall");
  };
  const unlock = () => { setStage("dashboard"); };
  const reset = () => {
    localStorage.removeItem(LS_KEY); localStorage.removeItem("btc_paid");
    setStage("branch"); setBKey(null); setProfile(null);
  };

  if (stage==="loading") return <div style={{minHeight:"100vh",background:"#0a0f1a",display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{color:"#4a5d70"}}>Loading…</p></div>;
  if (stage==="branch") return <BranchSelector onSelect={selectBranch}/>;
  if (stage==="setup") return <SetupScreen branch={BRANCHES[bKey]} onComplete={completeSetup}/>;
  if (stage==="paywall") return <PaywallScreen branch={BRANCHES[bKey]} onUnlock={unlock}/>;
  return <Dashboard branchKey={bKey} branch={BRANCHES[bKey]} profile={profile} onReset={reset}/>;
}
