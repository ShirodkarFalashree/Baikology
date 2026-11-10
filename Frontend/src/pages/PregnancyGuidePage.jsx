
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Apple,
  Heart,
  Stethoscope,
  Activity,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

const sections = [
  {
    title: 'Nutrition & Hydration',
    icon: Apple,
    color: '#E5F3E5',
    iconColor: '#477A50',
    intro: 'A varied, balanced diet helps support your health and your baby’s development.',
    points: [
      'Include fruits, vegetables, whole grains and protein-rich foods.',
      'Include iron-rich foods such as beans, lentils and leafy vegetables.',
      'Choose pasteurised milk and dairy products.',
      'Wash fruits and vegetables thoroughly.',
      'Avoid alcohol and raw or undercooked foods that may carry infection risks.',
      'Limit caffeine to the amount recommended by your healthcare provider.',
    ],
    source: 'https://www.who.int/tools/elena/interventions/nutrition-counselling-pregnancy',
  },
  {
    title: 'Common Pregnancy Symptoms',
    icon: Heart,
    color: '#FCE8EE',
    iconColor: '#A64F70',
    intro: 'Pregnancy affects everyone differently. Some commonly experienced changes include:',
    points: [
      'Nausea or vomiting',
      'Tiredness and changes in sleep',
      'Breast tenderness',
      'Frequent urination',
      'Constipation and heartburn',
      'Emotional changes',
    ],
    note: 'Symptoms vary from person to person. Discuss persistent, worsening or concerning symptoms with your healthcare provider.',
    source: 'https://www.nhs.uk/pregnancy/common-symptoms/',
  },
  {
    title: 'Prenatal Checkups',
    icon: Stethoscope,
    color: '#E8E8FA',
    iconColor: '#625A9B',
    intro: 'Regular antenatal care helps monitor your health and your baby’s development.',
    points: [
      'Arrange your first antenatal appointment early.',
      'Attend appointments recommended by your doctor.',
      'Discuss scans and recommended blood and urine tests.',
      'Ask your doctor about supplements and vaccinations.',
      'Keep a record of your appointments and questions.',
    ],
    source: 'https://www.who.int/publications/i/item/9789241549912',
  },
  {
    title: 'Everyday Wellness',
    icon: Activity,
    color: '#FFF1D9',
    iconColor: '#98702F',
    intro: 'Small daily habits can help you care for yourself throughout pregnancy.',
    points: [
      'Prioritise rest and adequate sleep.',
      'Stay hydrated throughout the day.',
      'Discuss suitable physical activity with your doctor.',
      'Take prescribed supplements as advised.',
      'Make time for emotional support and relaxation.',
      'Avoid starting medicines or supplements without medical advice.',
    ],
    source: 'https://www.who.int/tools/elena/interventions/nutrition-counselling-pregnancy',
  },
];

export default function PregnancyGuidePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8FC] px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        <button
          onClick={() => navigate('/pregnancy-dashboard')}
          className="flex items-center gap-2 text-[#756291] hover:text-[#493B5C] font-medium"
        >
          <ArrowLeft size={18} />
          Back to Pregnancy Dashboard
        </button>

        <header className="bg-gradient-to-r from-[#F1EAF9] to-[#FCECF0] rounded-[32px] p-7 sm:p-10">
          <p className="text-sm font-semibold text-[#806A9E] mb-3">
            BAIKOLOGY • PREGNANCY CARE
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold text-[#493B5C]">
            Your Pregnancy Health Guide
          </h1>

          <p className="mt-3 text-[#766B82] max-w-2xl leading-relaxed">
            A supportive space to learn about nutrition, body changes,
            prenatal care and everyday wellness during pregnancy.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#EDE6F3] shadow-sm space-y-5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: section.color }}
                  >
                    <Icon
                      size={23}
                      style={{ color: section.iconColor }}
                    />
                  </div>

                  <h2 className="text-xl font-semibold text-[#493B5C]">
                    {section.title}
                  </h2>
                </div>

                <p className="text-sm text-[#786E83] leading-relaxed">
                  {section.intro}
                </p>

                <ul className="space-y-3">
                  {section.points.map((point, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm text-[#655B70] leading-relaxed"
                    >
                      <span className="text-[#9B83BD] font-bold">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {section.note && (
                  <p className="text-xs bg-[#F8F3FB] rounded-xl p-3 text-[#756291]">
                    {section.note}
                  </p>
                )}

                <a
                  href={section.source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#806A9E] hover:underline"
                >
                  Learn more from trusted health sources
                  <ExternalLink size={14} />
                </a>
              </article>
            );
          })}
        </div>

        <div className="bg-[#FFF3E9] border border-[#F5DFCA] rounded-[28px] p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-[#A65B35]" size={23} />
            <h2 className="text-lg font-semibold text-[#70452F]">
              Important: When to seek medical help
            </h2>
          </div>

          <p className="text-sm text-[#795B4B] leading-relaxed mb-4">
            Seek urgent medical attention for symptoms such as:
          </p>

          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-[#795B4B]">
            <li>• Vaginal bleeding or fluid leakage</li>
            <li>• Severe or persistent abdominal pain</li>
            <li>• Severe headache or vision changes</li>
            <li>• Fever or difficulty breathing</li>
            <li>• Severe vomiting</li>
            <li>• Baby moving less than usual once movements are established</li>
          </ul>

          <p className="text-sm font-medium text-[#70452F] mt-5">
            Contact your maternity care provider immediately. If you cannot
            reach them, seek emergency medical care.
          </p>

          <a
            href="https://www.cdc.gov/hearher/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#986044] hover:underline"
          >
            View maternal warning signs
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="text-center py-4">
          <p className="text-xs text-[#92889D] leading-relaxed">
            Baikology provides general educational information, not medical
            diagnosis or treatment. Every pregnancy is different. Always
            follow advice from your qualified healthcare professional.
          </p>
        </div>

      </div>
    </div>
  );
}
