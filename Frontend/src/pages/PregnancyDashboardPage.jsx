
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPregnancyProfile } from '../api/auth';


const babyDevelopment = {
  4: {
    size: 'Poppy seed',
    length: 'About 2 mm',
    weight: 'Too small for a meaningful everyday estimate',
    measurement: 'Early embryo measurement',
    development: 'The embryo implants and early structures begin forming. The brain, spinal cord and heart-related tissue start developing.',
    mother: 'You may notice a missed period, tiredness, breast tenderness or nausea. Some people have no symptoms yet.',
  },
  8: {
    size: 'Raspberry',
    length: 'About 1.6 cm',
    weight: 'Not routinely estimated',
    measurement: 'Crown to rump',
    development: 'Arms, legs, fingers and toes are developing. Early facial features and the structures of major organs are forming.',
    mother: 'Nausea, tiredness, frequent urination and breast tenderness may occur.',
  },
  12: {
    size: 'Plum',
    length: 'About 5.5–6 cm',
    weight: 'About 14 g',
    measurement: 'Crown to rump',
    development: 'The face is becoming more defined. Fingernails are forming, kidneys are developing and the baby can make small movements.',
    mother: 'Nausea may begin to improve, although this varies. Your abdomen may start changing.',
  },
  16: {
    size: 'Avocado',
    length: 'About 11–12 cm',
    weight: 'About 100 g',
    measurement: 'Crown to rump',
    development: 'Bones are hardening, movements are becoming more coordinated and hearing is beginning to develop.',
    mother: 'You may notice changes in your appetite, energy and body shape.',
  },
  20: {
    size: 'Banana',
    length: 'About 25 cm',
    weight: 'About 300 g',
    measurement: 'Head to heel',
    development: 'The baby is moving more actively. Hearing develops, and soft hair called lanugo begins covering the body.',
    mother: 'Some people begin noticing movements around this stage. The anatomy scan is commonly offered around this period.',
  },
  24: {
    size: 'Corn on the cob',
    length: 'About 30 cm',
    weight: 'About 600 g',
    measurement: 'Head to heel',
    development: 'The baby develops stronger movements. Fingerprints are forming, and the lungs and brain continue developing.',
    mother: 'You may notice more distinct kicks and changes in your sleep or comfort.',
  },
  28: {
    size: 'Eggplant',
    length: 'About 38 cm',
    weight: 'About 1 kg',
    measurement: 'Head to heel',
    development: 'The eyes can open and close. The brain is developing rapidly, and the lungs are producing substances important for breathing after birth.',
    mother: 'You may notice stronger movements, back discomfort or difficulty finding a comfortable sleeping position.',
  },
  32: {
    size: 'Squash',
    length: 'About 43 cm',
    weight: 'About 1.7–1.9 kg',
    measurement: 'Head to heel',
    development: 'The baby can stretch, kick and make grasping movements. The brain and nervous system continue maturing, while the baby gains weight.',
    mother: 'Your abdomen may feel heavier. Rest and comfortable movement become increasingly important.',
  },
  36: {
    size: 'Romaine lettuce',
    length: 'About 46–47 cm',
    weight: 'About 2.6–2.8 kg',
    measurement: 'Head to heel',
    development: 'The baby continues gaining fat. The brain and lungs are maturing, and many babies move into a head-down position.',
    mother: 'You may experience increased pelvic pressure and more frequent practice contractions.',
  },
  40: {
    size: 'Pumpkin',
    length: 'About 50–51 cm',
    weight: 'About 3.4 kg',
    measurement: 'Head to heel',
    development: 'The baby is around the estimated due-date stage. The brain and lungs continue developing, and the body is prepared for life outside the womb.',
    mother: 'Labour may begin around this time, but babies do not necessarily arrive on their estimated due date.',
  },
};

function getBabyDevelopment(week) {
  const milestones = Object.keys(babyDevelopment)
    .map(Number)
    .sort((a, b) => a - b);

  const milestoneWeek = milestones
    .filter((item) => item <= week)
    .pop();

  if (!milestoneWeek) {
    return {
      milestoneWeek: null,
      size: 'Too early for a fruit comparison',
      length: 'Not available',
      weight: 'Not available',
      measurement: '',
      development: 'Pregnancy dating starts from the first day of your last menstrual period. Early development begins after fertilisation.',
      mother: 'You may not notice any pregnancy symptoms yet.',
    };
  }

  return {
    milestoneWeek,
    ...babyDevelopment[milestoneWeek],
  };
}


function dateFromString(value) {
  if (!value) return null;
  const date = new Date(`${value.split('T')[0]}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getPregnancyDates(profile) {
  const dueDate = dateFromString(profile?.dueDate);
  let lmp = dateFromString(profile?.lastMenstrualPeriod);

  if (!lmp && dueDate) {
    lmp = new Date(dueDate);
    lmp.setUTCDate(lmp.getUTCDate() - 280);
  }

  if (!dueDate && lmp) {
    const calculated = new Date(lmp);
    calculated.setUTCDate(calculated.getUTCDate() + 280);
    return { lmp, dueDate: calculated };
  }

  return { lmp, dueDate };
}

function getWeekInfo(lmp) {
  if (!lmp) return { week: null, days: null };

  const today = new Date();
  const todayUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const difference = Math.floor((todayUTC - lmp.getTime()) / 86400000);

  if (difference < 0) return { week: 0, days: 0 };

  return {
    week: Math.floor(difference / 7) + 1,
    days: difference % 7,
  };
}

function getTrimester(week) {
  if (week <= 13) return 'First Trimester';
  if (week <= 27) return 'Second Trimester';
  return 'Third Trimester';
}

function getBabyUpdate(week) {
  if (weeklyContent[week]) return weeklyContent[week];

  if (week < 4) {
    return 'Your pregnancy is in its early stages. Development begins with the earliest changes after conception.';
  }

  if (week < 13) {
    return 'Your baby is developing important organs and early body structures.';
  }

  if (week < 28) {
    return 'Your baby continues growing, developing movement, senses and important body functions.';
  }

  if (week < 37) {
    return 'Your baby is gaining weight while the brain, lungs and other organs continue maturing.';
  }

  return 'Your baby is continuing to prepare for birth. Every pregnancy develops at its own pace.';
}

export default function PregnancyDashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('baikology_token');

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await getPregnancyProfile(token);

      if (!response.success) {
        setError(response.message || 'Unable to load your pregnancy profile.');
        setLoading(false);
        return;
      }

      const pregnancyData = response.data?.data ?? response.data;

      if (!pregnancyData?.isCompleted) {
        navigate('/pregnancy-onboarding');
        return;
      }

      setProfile(pregnancyData);
      setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF8FF] text-[#80629F]">
        Loading your pregnancy journey...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FBF8FF] p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-[#987BB5] px-5 py-2 text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const { lmp, dueDate } = getPregnancyDates(profile);
  const { week, days } = getWeekInfo(lmp);

  const safeWeek = Math.min(week || 1, 42);
  const babyInfo = getBabyDevelopment(safeWeek);
  const trimester = getTrimester(safeWeek);
  const daysRemaining = dueDate
    ? Math.ceil((dueDate.getTime() - Date.now()) / 86400000)
    : null;

  const formattedDueDate = dueDate
    ? dueDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : 'Not available';

  const progress = Math.min((safeWeek / 40) * 100, 100);

  return (
    <div className="min-h-screen bg-[#FBF8FF] px-4 py-8 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-7">

        <header className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-[#987BB5]">
              BAIKOLOGY · PREGNANCY CARE
            </p>
            <h1 className="text-3xl font-bold text-[#463653] mt-2">
              Your pregnancy journey
            </h1>
            <p className="text-gray-500 mt-1">
              A little guidance for every step of your journey.
            </p>
          </div>

          <button
            onClick={() => navigate('/journey')}
            className="rounded-xl border border-[#E9DFFF] bg-white px-2 py-2 text-sm text-[#80629F]"
          >
            Change journey
          </button>


          <button
  onClick={() => navigate('/pregnancy-edit')}
  className="rounded-xl border border-[#E9DFFF] bg-white px-4 py-2 text-sm text-[#80629F]"
>
  Edit Pregnancy Details
         </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white rounded-3xl border border-[#E9DFFF] p-6">
            <p className="text-sm text-gray-500">Your pregnancy</p>
            <h2 className="text-4xl font-bold text-[#80629F] mt-3">
              Week {safeWeek}
            </h2>
            <p className="text-gray-500 mt-2">
              {days} {days === 1 ? 'day' : 'days'} into this week
            </p>
            <p className="text-sm font-medium text-[#987BB5] mt-4">
              {trimester}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E9DFFF] p-6">
            <p className="text-sm text-gray-500">Estimated due date</p>
            <h2 className="text-2xl font-bold text-[#80629F] mt-4">
              {formattedDueDate}
            </h2>
            <p className="text-sm text-gray-500 mt-3">
              {daysRemaining === null
                ? 'Due date unavailable'
                : daysRemaining > 0
                  ? `${daysRemaining} days remaining`
                  : daysRemaining === 0
                    ? 'Estimated due date is today'
                    : 'Estimated due date has passed'}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E9DFFF] p-6">
            <p className="text-sm text-gray-500">Pregnancy progress</p>
            <h2 className="text-4xl font-bold text-[#80629F] mt-3">
              {Math.round(progress)}%
            </h2>
            <div className="w-full h-3 bg-[#F0EAF7] rounded-full mt-5 overflow-hidden">
              <div
                className="h-full bg-[#987BB5] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Based on an estimated 40-week pregnancy
            </p>
          </div>
        </section>


<section className="bg-white rounded-3xl border border-[#E9DFFF] p-6 sm:p-8 space-y-6">

  <div>
    <p className="text-sm font-semibold text-[#987BB5]">
      THIS WEEK'S BABY DEVELOPMENT
    </p>

    <h2 className="text-2xl font-bold text-[#463653] mt-3">
      Week {safeWeek}: Your little one is growing!
    </h2>

    <p className="text-sm text-gray-500 mt-2">
      {babyInfo.milestoneWeek
        ? `Development details around week ${babyInfo.milestoneWeek}`
        : 'Early pregnancy development'}
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

    <div className="bg-[#F8F2FC] rounded-2xl p-5">
      <p className="text-sm text-gray-500">Approximate size</p>
      <h3 className="text-xl font-bold text-[#80629F] mt-2">
        {babyInfo.size}
      </h3>
      <p className="text-xs text-gray-400 mt-2">
        Fruit comparison
      </p>
    </div>

    <div className="bg-[#F8F2FC] rounded-2xl p-5">
      <p className="text-sm text-gray-500">Approximate length</p>
      <h3 className="text-xl font-bold text-[#80629F] mt-2">
        {babyInfo.length}
      </h3>
      <p className="text-xs text-gray-400 mt-2">
        {babyInfo.measurement}
      </p>
    </div>

    <div className="bg-[#F8F2FC] rounded-2xl p-5">
      <p className="text-sm text-gray-500">Approximate weight</p>
      <h3 className="text-xl font-bold text-[#80629F] mt-2">
        {babyInfo.weight}
      </h3>
      <p className="text-xs text-gray-400 mt-2">
        General developmental estimate
      </p>
    </div>

  </div>

  <div className="space-y-3">
    <h3 className="text-lg font-bold text-[#463653]">
      What's happening with your baby?
    </h3>
    <p className="text-gray-600 leading-7">
      {babyInfo.development}
    </p>
  </div>

  <div className="bg-[#FFF5F8] rounded-2xl p-5">
    <h3 className="font-bold text-[#80566C]">
      What you may experience
    </h3>
    <p className="text-sm text-[#806A78] leading-7 mt-2">
      {babyInfo.mother}
    </p>
  </div>

  <p className="text-xs text-gray-400 leading-relaxed">
    These are approximate population-level educational estimates.
    Fruit comparisons are illustrative. Measurements and growth vary
    between pregnancies. Early length is measured crown-to-rump;
    later length is measured head-to-heel. Your ultrasound and
    healthcare professional provide individual growth information.
  </p>

</section>


        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-3xl border border-[#E9DFFF] p-6">
            <h3 className="text-lg font-bold text-[#463653]">
              Your wellness matters
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Keep track of how you feel, your sleep and your energy.
            </p>
            <button
              onClick={() => navigate('/pregnancy-wellness')}
              className="mt-5 text-sm font-semibold text-[#80629F]"
            >
              Explore wellness →
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E9DFFF] p-6">
            <h3 className="text-lg font-bold text-[#463653]">
              Pregnancy health guide
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Explore educational guidance on nutrition, common symptoms and prenatal care.
            </p>
            <button
              onClick={() => navigate('/pregnancy-guide')}
              className="mt-5 text-sm font-semibold text-[#80629F]"
            >
              Explore health guide →
            </button>
          </div>
        </section>

        <p className="text-xs text-gray-400 text-center pb-5">
          Pregnancy weeks and due dates are estimates, not medical assessments.
          Please confirm pregnancy dating with your healthcare professional.
        </p>
      </div>
    </div>
  );
}
