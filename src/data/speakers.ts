export type SpeakerRole = 'lecture' | 'workshop' | 'moderator' | 'panelist' | 'chair' | 'cochair';

export interface SpeakerAppearance {
  role: SpeakerRole;
  /** Short session name shown on the card. */
  session: string;
  /** Schedule session id (e.g. 'd1-18') so the card can open the session. Optional. */
  sessionId?: string;
}

export interface Speaker {
  name: string;
  designation?: string;
  institution?: string;
  image?: string;
  appearances: SpeakerAppearance[];
}

export const SPEAKER_ROLE_LABELS: Record<SpeakerRole, string> = {
  lecture: 'Lecture',
  workshop: 'Workshop',
  moderator: 'Moderator',
  panelist: 'Panelist',
  chair: 'Chair',
  cochair: 'Co-chair',
};

/** Derived from APTICON 2026 "Detailed scientific schedule" (revised 19-10-26). */
export const SPEAKERS: Speaker[] = [
  {
    name: 'Shri B. R. Shankaranand Ji',
    designation: 'All India Organizing Secretary',
    institution: 'Bharatiya Shikshan Mandal (BSM)',
    appearances: [{ role: 'lecture', session: 'KLE Oration Lecture', sessionId: 'd1-15' }],
  },
  {
    name: 'Prof. Umesh Banakar',
    designation: 'Professor and President',
    institution: 'Banakar Consulting Services, Westfield, Indiana, USA. Founder, Goa Center for Excellence in Intellectual Property (GCEIP)',
    appearances: [{ role: 'lecture', session: 'Dr. G. Bhagwant Memorial Lecture', sessionId: 'd1-16' }],
  },
  {
    name: 'Prof. Vandana Patravale',
    designation: 'Professor, Pharmaceutics',
    institution: 'Institute of Chemical Technology, Mumbai',
    appearances: [{ role: 'lecture', session: 'M. L. Schroff Memorial Lecture', sessionId: 'd1-18' }, { role: 'panelist', session: 'Panel Discussion II — Women Forum', sessionId: 'd2-12' }],
  },
  {
    name: 'Prof. Ing. Ladislav Kokoska',
    designation: 'Professor, Faculty of Tropical AgriSciences',
    institution: 'Czech University of Life Sciences, Prague',
    appearances: [{ role: 'lecture', session: 'Dr. G. P. Srivastava Memorial Lecture', sessionId: 'd1-19' }],
  },
  {
    name: 'Prof. Manish Chaurasiya',
    designation: 'Scientist G',
    institution: 'CSIR-Central Drug Research Institute, Lucknow',
    appearances: [{ role: 'lecture', session: 'Shri A. Mishra Memorial Lecture in Pharmaceutical Technology', sessionId: 'd1-20' }],
  },
  {
    name: 'Dr. Dharmendra Ahuja',
    institution: 'Bureau for Health and Education Experimental Pharmacology Software',
    appearances: [{ role: 'workshop', session: 'Workshop on AI Softwares', sessionId: 'd1-21' }],
  },
  {
    name: 'Prof. M. D. Burande',
    designation: 'Director, Pharmaceutical Sciences',
    institution: 'JSPM University, Wagholi, Pune',
    appearances: [{ role: 'lecture', session: 'J. S. S. Oration Lecture', sessionId: 'd2-10' }],
  },
  {
    name: 'Prof. Sanjay Jain',
    designation: 'Professor, Department of Pharmaceutics',
    institution: 'Dr. H. S. Gour University, Sagar, MP',
    appearances: [{ role: 'lecture', session: '54th IPC Trust Sponsored Lecture', sessionId: 'd2-13' }],
  },
  {
    name: 'Prof. Rakesh Somani',
    designation: 'Principal, School of Pharmacy',
    institution: 'DY Patil University, Navi Mumbai',
    appearances: [{ role: 'moderator', session: 'Panel Discussion I', sessionId: 'd1-17' }],
  },
  {
    name: 'Prof. Vandana Soni',
    designation: 'Professor, Department of Pharmaceutical Sciences',
    institution: 'Dr. Harisingh Gour Vishwavidyalaya',
    appearances: [{ role: 'moderator', session: 'Panel Discussion II — Women Forum', sessionId: 'd2-12' }],
  },
  {
    name: 'Prof. Rohit Dutt',
    designation: 'Vice-President, APTI North Zone',
    appearances: [{ role: 'moderator', session: 'Panel Discussion III', sessionId: 'd2-14' }],
  },
  {
    name: 'Dr. Ajay Sachan',
    designation: 'Deputy Drugs Controller India',
    institution: 'CDSCO, Ahmedabad Zone, Ministry of Health and Family Welfare, Govt. of India',
    appearances: [{ role: 'panelist', session: 'Panel Discussion I', sessionId: 'd1-17' }],
  },
  {
    name: 'Dr. Tilak Raj Bhardwaj',
    institution: 'Baddi University of Engineering Science and Technology, Baddi, HP',
    appearances: [{ role: 'panelist', session: 'Panel Discussion I', sessionId: 'd1-17' }],
  },
  {
    name: 'Dr. Akash Ved',
    designation: 'Professor and Head',
    institution: 'Dr. A.P.J. Abdul Kalam Technical University, UP',
    appearances: [{ role: 'panelist', session: 'Panel Discussion I', sessionId: 'd1-17' }],
  },
  {
    name: 'Prof. Sohan Chitlange',
    designation: 'Vice-President APTI West Zone; Vice Chancellor',
    institution: 'ALARD University, Pune',
    appearances: [{ role: 'panelist', session: 'Panel Discussion I', sessionId: 'd1-17' }],
  },
  {
    name: 'Prof. M. Venkat Ramanna',
    designation: 'Vice-President, APTI South Zone',
    appearances: [{ role: 'panelist', session: 'Panel Discussion I', sessionId: 'd1-17' }],
  },
  {
    name: 'Mr. Manoj Karwa',
    designation: 'Head – Clinical Trials & Pharmacovigilance',
    institution: 'Auriga Research Pvt Ltd',
    appearances: [{ role: 'panelist', session: 'Panel Discussion I', sessionId: 'd1-17' }],
  },
  {
    name: 'Dr. Vikas Batra',
    designation: 'Senior Group Leader (R&D)',
    institution: 'Sun Pharma, Gurugram',
    appearances: [{ role: 'panelist', session: 'Panel Discussion I', sessionId: 'd1-17' }],
  },
  {
    name: 'Prof. Meena Chintamaneni',
    designation: 'Pro Vice-Chancellor',
    institution: 'NMIMS Deemed to be University, Mumbai',
    appearances: [{ role: 'panelist', session: 'Panel Discussion II — Women Forum', sessionId: 'd2-12' }],
  },
  {
    name: 'Prof. Milind J. Umekar',
    designation: 'President, APTI; Director',
    institution: 'Smt. Kishoritai Bhoyar College of Pharmacy, Kamptee, Nagpur',
    appearances: [{ role: 'panelist', session: 'Panel Discussion II — Women Forum', sessionId: 'd2-12' }],
  },
  {
    name: 'Prof. Deependra Singh',
    designation: 'Chairman ERC, Pharmacy Council of India; Professor',
    institution: 'University Institute of Pharmacy, Pt. Ravishankar Shukla University, Raipur',
    appearances: [{ role: 'panelist', session: 'Panel Discussion II — Women Forum', sessionId: 'd2-12' }],
  },
  {
    name: 'Prof. Suneela Dhaneswar',
    designation: 'Director',
    institution: 'Amity University, Mumbai',
    appearances: [{ role: 'panelist', session: 'Panel Discussion II — Women Forum', sessionId: 'd2-12' }],
  },
  {
    name: 'Dr. Sanju Nanda',
    designation: 'Professor, Department of Pharmaceutical Sciences',
    institution: 'Maharshi Dayanand University, Rohtak, Haryana',
    appearances: [{ role: 'panelist', session: 'Panel Discussion II — Women Forum', sessionId: 'd2-12' }],
  },
  {
    name: 'Dr. Lovleen Kumar',
    designation: 'Associate Director, Analytical Research & Development',
    institution: 'Dr. Reddy\'s Laboratories, Hyderabad',
    appearances: [{ role: 'panelist', session: 'Panel Discussion III', sessionId: 'd2-14' }],
  },
  {
    name: 'Dr. Nagendra K Singh',
    designation: 'Lead, Global MS&T Capacity Hub',
    institution: 'Sandoz, Hyderabad',
    appearances: [{ role: 'panelist', session: 'Panel Discussion III', sessionId: 'd2-14' }],
  },
  {
    name: 'Dr. Sandeep Suryavanshi',
    designation: 'Deputy General Manager',
    institution: 'Alkem, Daman, Vapi',
    appearances: [{ role: 'panelist', session: 'Panel Discussion III', sessionId: 'd2-14' }],
  },
  {
    name: 'Mr. Kishor Jadwani',
    designation: 'Chancellor',
    institution: 'Columbia Professional University',
    appearances: [{ role: 'panelist', session: 'Panel Discussion III', sessionId: 'd2-14' }],
  },
  {
    name: 'Prof. Umesh Patil',
    designation: 'Department of Pharmaceutical Sciences',
    institution: 'Dr. Harisingh Gour Vishwavidyalaya',
    appearances: [{ role: 'panelist', session: 'Panel Discussion III', sessionId: 'd2-14' }],
  },
  {
    name: 'Mr. Rahul Tiwari',
    designation: 'Vice President',
    institution: 'Chhattisgarh State Pharmacy Council, Raipur',
    appearances: [{ role: 'panelist', session: 'Panel Discussion III', sessionId: 'd2-14' }],
  },
  {
    name: 'Dr. H. N. More',
    designation: 'Principal',
    institution: 'Bharati Vidyapeeth College of Pharmacy, Kolhapur',
    appearances: [{ role: 'panelist', session: 'Panel Discussion III', sessionId: 'd2-14' }],
  },
  {
    name: 'Prof. Arun Nanda',
    designation: 'Professor',
    institution: 'Maharshi Dayanand University, Rohtak, Haryana',
    appearances: [{ role: 'chair', session: 'KLE Oration Lecture', sessionId: 'd1-15' }],
  },
  {
    name: 'Prof. Anil Pethe',
    designation: 'Professor & Dean, Datta Meghe College of Pharmacy',
    institution: 'Adani Institute of Higher Education & Research, Deemed University, Wardha',
    appearances: [{ role: 'cochair', session: 'KLE Oration Lecture', sessionId: 'd1-15' }],
  },
  {
    name: 'Prof. Prabhakar Veera Reddy',
    institution: 'University College of Pharmaceutical Sciences, Palamuru University, Mahabubnagar, Telangana',
    appearances: [{ role: 'chair', session: 'Dr. G. Bhagwant Memorial Lecture', sessionId: 'd1-16' }],
  },
  {
    name: 'Dr. Sarath Chandran C',
    designation: 'CC Member, PCI',
    institution: 'College of Pharmaceutical Sciences, Govt Medical College Kannur, Pariyaram',
    appearances: [{ role: 'cochair', session: 'Dr. G. Bhagwant Memorial Lecture', sessionId: 'd1-16' }],
  },
  {
    name: 'Dr. Narendra Devanaboyina',
    designation: 'Principal',
    institution: 'VJ\'s College of Pharmacy, Rajahmundry, Andhra Pradesh',
    appearances: [{ role: 'chair', session: 'M. L. Schroff Memorial Lecture', sessionId: 'd1-18' }],
  },
  {
    name: 'Dr. Vishal Kumar Gupta',
    designation: 'Dean (Academics)',
    institution: 'JSS Academy of Higher Education and Research, Mysuru',
    appearances: [{ role: 'cochair', session: 'M. L. Schroff Memorial Lecture', sessionId: 'd1-18' }],
  },
  {
    name: 'Prof. Kamla Pathak',
    designation: 'Director, Research and Innovation',
    institution: 'Lloyd Group of Institutions, Greater Noida',
    appearances: [{ role: 'chair', session: 'Dr. G. P. Srivastava Memorial Lecture', sessionId: 'd1-19' }],
  },
  {
    name: 'Prof. Vandana Garg',
    designation: 'Professor',
    institution: 'Maharshi Dayanand University (MDU), Rohtak, Haryana',
    appearances: [{ role: 'cochair', session: 'Dr. G. P. Srivastava Memorial Lecture', sessionId: 'd1-19' }],
  },
  {
    name: 'Prof. Raman Dang',
    designation: 'Principal',
    institution: 'Krupanidhi College of Pharmacy, Bangalore',
    appearances: [{ role: 'chair', session: 'Shri A. Mishra Memorial Lecture in Pharmaceutical Technology', sessionId: 'd1-20' }],
  },
  {
    name: 'Dr. Akhlesh K. Singhai',
    designation: 'Director, School of Pharmacy',
    institution: 'LNCT University, Bhopal',
    appearances: [{ role: 'cochair', session: 'Shri A. Mishra Memorial Lecture in Pharmaceutical Technology', sessionId: 'd1-20' }],
  },
  {
    name: 'Dr. K. Ravi Shankar',
    designation: 'Principal & Professor',
    institution: 'Aditya College of Pharmacy, Kakinada, Andhra Pradesh',
    appearances: [{ role: 'cochair', session: 'Shri A. Mishra Memorial Lecture in Pharmaceutical Technology', sessionId: 'd1-20' }],
  },
  {
    name: 'Dr. Surendra H. Bodake',
    designation: 'HOD, Department of Pharmacology',
    institution: 'GGU, Bilaspur',
    appearances: [{ role: 'chair', session: 'J. S. S. Oration Lecture', sessionId: 'd2-10' }],
  },
  {
    name: 'Dr. Mohammed Haneefa',
    designation: 'Principal',
    institution: 'Moulana College of Pharmacy, Angadippuram, Kerala',
    appearances: [{ role: 'cochair', session: 'J. S. S. Oration Lecture', sessionId: 'd2-10' }],
  },
  {
    name: 'Prof. N. V. V. Jagan Mohan Reddy',
    designation: 'Professor',
    institution: 'VJ\'s College of Pharmacy, Rajahmundry, Andhra Pradesh',
    appearances: [{ role: 'chair', session: '54th IPC Trust Sponsored Lecture', sessionId: 'd2-13' }],
  },
  {
    name: 'Dr. K. Venkat Ramanna',
    designation: 'President, APTI AP State Branch',
    appearances: [{ role: 'cochair', session: '54th IPC Trust Sponsored Lecture', sessionId: 'd2-13' }],
  },
  {
    name: 'Prof. Ravindra D. Hiremath',
    designation: 'Principal',
    institution: 'Future Institute of Pharmacy, Future University, U.P.',
    appearances: [{ role: 'cochair', session: '54th IPC Trust Sponsored Lecture', sessionId: 'd2-13' }],
  },
];
