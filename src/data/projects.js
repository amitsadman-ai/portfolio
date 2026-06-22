export const projects = [
  {
    slug: 'ux-ui-app-fixes',
    tag: 'Mobile',
    logos: [
      { label: 'BuyMe', src: '/assets/buyme-logo-nobg.png' },
      { label: 'bit', src: '/assets/bit-logo.png' },
      { label: 'WhatsApp', src: '/assets/whatsapp-logo.webp' },
    ],
    image: '/assets/fixes-v3.png',
    title: 'Same apps, game-changing solutions.',
    body: 'Designing high-impact features for the platforms you use every single day.',
    csBody: [
      'How many times have you run into a problem while using a popular app?',
      "On this page you'll find solutions and features I designed to solve challenges I faced using these daily-basis apps.",
    ],
    apps: [
      {
        name: 'BuyMe',
        logo: '/assets/buyme-logo-nobg.png',
        banner: '/assets/buyme-banner-v4.webp',
        title: "Redesign 'My Gift' Page",
        subtitle: [
          'Did you celebrate a wedding, engagement, birthday, or host a holiday event and receive BuyMe vouchers as gifts? 🎁',
          'Over time, those vouchers start to accumulate, especially when you don’t use them right away.\nAt some point, managing them becomes a frustrating experience:',
          '• How many vouchers do I actually have?\n• What categories are they for?\n• How much are they all worth together?',
          'Instead of getting a clear overview, users are forced to manually calculate everything themselves',
        ],
        problem: [
          'Currently, the “My Gifts” page displays a long list of vouchers without clear separation between them, making it difficult for users to quickly scan the page. To view more details, users need to enter each voucher individually instead of getting most of the information directly from the main screen.',
          'Another issue is that the option to add a new voucher only appears at the bottom of the page, after users have already scrolled through the entire list.',
        ],
        today: ['/assets/buyme-today-1.webp', '/assets/buyme-today-2.webp', '/assets/buyme-today-3.webp'],
        solution: [
          'A general section summarizing how many vouchers the user has and their total value.',
          'An option to add a new voucher, pinned to the top of the page.',
          'The ability to open and close each category, so the user can focus on exactly what they’re looking for.',
          'Vouchers divided into separate categories.',
          {
            text: 'Each category shows:',
            children: [
              'A summary of the category’s voucher quantity and value.',
              'A detailed list of every voucher in the category, including the sender, expiry date, reminders, how much has been spent and how much is left, and an option to open it on a separate page.',
            ],
          },
        ],
        gallery: [
          '/assets/buyme-new-1.webp',
          '/assets/buyme-new-2.webp',
          '/assets/buyme-new-3.webp',
          '/assets/buyme-new-4.webp',
          '/assets/buyme-new-5.webp',
        ],
        cta: { label: 'See it in action', href: 'https://mygiftredesign.netlify.app/' },
      },
      {
        name: 'bit',
        logo: '/assets/bit-logo.png',
        banner: '/assets/bit-banner-v3.webp',
        bannerShift: 0,
        title: 'Cancellation option feature',
        subtitle: 'Improving transparency and communication when money transfers are canceled.',
        problem: [
          'Today, the Bit app allows users to received and transfer money, but it doesn’t provide any context when a transfer is declined. When Daniel sends money to Tomer, then Tomer chooses not to accept it, Daniel receives no explanation and, in some cases, may not even realize the transfer was canceled.',
          'I encountered this issue myself. After transferring money to a colleague who had ordered lunch for the team, I noticed two weeks later that I had never received confirmation that the payment had been accepted. When I checked the app, I discovered that the transfer had been canceled.',
          'At first, I wasn’t sure why the payment had been declined. Only after investigating further I realize that I had accidentally sent the money to the wrong person.',
          'This experience highlighted a gap in the current flow: users are not informed why a transfer was canceled, making it difficult to understand what happened and what action should be taken next.',
          'In addition to the functional gap, I identified several inconsistencies in the design language:',
          {
            bullets: [
              'CTA styles are inconsistent throughout the flow. Some buttons use a square shape while others use a pill shape, creating an inconsistent visual experience.',
              'Different actions share the same visual treatment. The “Request”, “Receive”, and “Cancel” actions all use the same color, making it difficult for users to quickly distinguish between actions with different meanings and outcomes.',
            ],
          },
          { image: '/assets/buyme-buttons.webp', alt: 'Bit action buttons — Request, Receive, Cancel all sharing the same color treatment' },
          'These inconsistencies can increase cognitive load and reduce clarity, especially in a flow that involves financial transactions.',
        ],
        today: ['/assets/bit-today-1.webp', '/assets/bit-today-2.webp', '/assets/bit-today-3.webp'],
        solution: {
          intro: [
            'To increase transparency and reduce confusion around canceled transfers, I redesigned the cancellation flow to collect and communicate the reason behind the action.',
            'When a user chooses to cancel a transfer, they are prompted to select a cancellation reason from a predefined list. Common reasons are surfaced as quick options, helping users complete the action with minimal effort.',
            'If none of the suggested reasons apply, the user can select “Other” and provide a custom explanation. This ensures that every cancellation can be accompanied by meaningful context.',
            'Once the transfer is canceled, the selected reason is displayed in the transaction details and communicated to the sender. This gives both parties a clear understanding of what happened and helps prevent unnecessary confusion or follow-up messages.',
            'By adding context to canceled transfers, the experience becomes more transparent, informative, and user-friendly.',
          ],
        },
        gallery: [
          '/assets/bit-new-1-v2.webp',
          '/assets/bit-new-2-v2.webp',
          '/assets/bit-new-3-v2.webp',
          '/assets/bit-new-4-v2.webp',
          '/assets/bit-new-5-v3.webp',
        ],
        flowName: 'User Cancels Side',
        flow2Name: 'User Transfer Side',
        flow2Image: '/assets/bit-new-6.webp',
      },
      {
        name: 'WhatsApp',
        logo: '/assets/whatsapp-logo.webp',
        banner: '/assets/ws-banner-v3.webp',
        bannerShift: 0,
        title: 'Scheduled message feature',
        subtitle: 'Helping users send messages at the right time, not just instantly.',
        problem: [
          'I wouldn’t define this as a major “problem,” since apps like WhatsApp already answer most of our communication needs very well. However, during one of my vacations overseas, I experienced a small but frustrating situation that WhatsApp didn’t provide a solution for.',
          'While traveling, the local time was 5 hours ahead of Israel. I needed to send messages to people who weren’t close friends or family, and every time I was about to message them at 8–9 AM my time, I realized it was the middle of the night for them. This meant they probably wouldn’t reply, and worse, the message might wake them up.',
          'Because of that, I decided to send the messages later in the day. But as often happens, I forgot and only remembered once the day was already over.',
          'That experience made me think: why doesn’t WhatsApp offer a scheduled message feature like many other platforms and apps?',
        ],
        today: [],
        solution: {
          intro: [
            'Many communication platforms already support scheduled messages (see examples below).\nTo keep the experience intuitive, I adopted a familiar pattern: users can long-press the Send button to access scheduling options and choose either a suggested time or a custom date and time.',
            'Seeing this functionality successfully implemented elsewhere strengthened the idea that scheduled messages could also improve the WhatsApp experience.',
          ],
          platforms: [
            {
              name: 'Slack',
              logo: '/assets/slack-icon.webp',
              screens: ['/assets/slack-platform.webp', '/assets/slack-platform-2.webp'],
            },
            {
              name: 'Telegram',
              logo: '/assets/telegram-icon.webp',
              screens: ['/assets/telegram-platform.webp'],
            },
            {
              name: 'Gmail',
              logo: '/assets/gmail-icon.webp',
              screens: ['/assets/gmail-platform.webp'],
            },
            {
              name: 'iMessage',
              logo: '/assets/imessage-logo.svg',
              screens: ['/assets/imessage-platform-nobg.webp'],
            },
          ],
        },
        gallery: [
          '/assets/ws-new-1.webp',
          '/assets/ws-new-2.webp',
          '/assets/ws-new-3.webp',
          '/assets/ws-new-4.webp',
          '/assets/ws-new-5-v2.webp',
          '/assets/ws-new-6.webp',
        ],
      },
    ],
  },
  {
    slug: 'israel-airports-authority',
    tag: 'Mobile App',
    banner: '/assets/iaa-banner-v3.webp',
    logos: [{ label: 'Israel Airports Authority', src: '/assets/iaa-logo.png' }],
    image: '/assets/iaa-screenshot-v2.png',
    title: "Israel Airports Authority's 1st Shift Management App",
    shortName: 'IAA shift Management App',
    body: 'For the first time, Israel airport employees will now be able to manage their shifts and communicate with HR easily.',
    csBody: [
      'A shift management app designed for employees of the Israel Airports Authority, enabling them to request and manage shifts for upcoming weeks, track monthly working hours, receive important updates, and communicate directly with HR.',
      'I had the privilege of leading this project from the ground up, from identifying the problem and defining the user experience to designing the complete solution. The concept was presented to airport authority managers and received highly positive feedback from stakeholders across multiple levels of the organization.',
    ],
    problem: [
      'The Israel Airports Authority employs thousands of people across a wide range of departments and roles. Despite being one of Israel’s largest and most complex organizations, many employee management processes still rely on outdated systems and manual workflows.',
      'Shift planning, employee requests, and workforce management are primarily handled by the HR department through legacy software that is neither intuitive nor user-friendly. Common tasks such as requesting time off, changing shifts, or submitting availability often require employees to complete manual forms and communicate through multiple channels.',
      'These processes create unnecessary friction for both employees and HR teams, resulting in slower communication, limited transparency, and a lack of flexibility in managing work schedules.',
    ],
    today: [
      { src: '/assets/iaa-today-transportation.webp', title: 'Transportation request' },
      { src: '/assets/iaa-today-calendar.webp', title: 'Shift monthly calendar summary' },
      { src: '/assets/iaa-today-shifts.webp', title: 'Weekly Shifts Request' },
    ],
    research: {
      label: "IAA's employee (User Research)",
      people: [
        {
          image: '/assets/iaa-hagar.webp',
          name: 'Hagar',
          age: 24,
          role: 'Student',
          experience: '2 years.',
          quote:
            "I'm using the system almost every day and it is inefficient in no way. The interface is unfriendly and modern and sure is not suitable for a respectable workplace like IAA. The process of changing shifts, transportation, and arranging access should be easy and not outdated",
        },
        {
          image: '/assets/iaa-tamir.webp',
          name: 'Tamir',
          age: 32,
          role: 'Security Manager',
          experience: '5 years.',
          quote:
            'The system we are using today does not withstand the pressures and collapses quite often. It is difficult to remember all the codes of the shifts. There are many errors with the system, and it is inaccessible and\nuncomfortable for us',
        },
      ],
    },
    solution: 'The concept was born from a clear employee need: a simpler and more efficient way to manage shift requests, improve communication with HR, and provide greater flexibility and control over work schedules.',
    newScreens: [
      {
        title: 'Login + Home page',
        description: [
          'The home screen serves as a central hub, providing employees with quick access to the information they need most, including upcoming shifts, important updates, vacation balances, sick days, and other relevant work-related information.',
          'The navigation menu gives users access to key actions such as requesting shifts for upcoming weeks, viewing their work calendar, exchanging shifts with colleagues, and communicating directly with HR all from a single, accessible platform.',
        ],
        layout: 'phone-scene',
        backdrop: 'navy',
        arrow: { from: 1, to: 2 },
        images: [
          '/assets/iaa-home-page-1.webp',
          '/assets/iaa-home-page.webp',
          '/assets/iaa-main-page.webp',
        ],
      },
      {
        title: 'Monthly shifts calendar',
        description: [
          'The Shift Calendar gives employees a clear overview of their schedule, allowing them to track their work schedule throughout the month. Users can review previous shifts, stay informed about upcoming shifts, and monitor their monthly hours.',
          'The calendar can be viewed in two modes:',
          '**Compact View**',
          'Provides quick access to key shift information, including shift swaps, shift-related notes, and the employee’s remaining monthly working hours.',
          '**Expanded View**',
          'Displays additional details for each shift, including the assigned terminal or work location, giving employees a more complete view of their monthly schedule and an option to track their time they arrived and left work.',
        ],
        layout: 'phone-row',
        images: [
          '/assets/iaa-monthly-calendar.webp',
          '/assets/iaa-monthly-calendar-1.webp',
          '/assets/iaa-monthly-calendar-2.webp',
        ],
      },
      {
        title: 'Request Weekly Shift & Exchange Shifts',
        layout: 'phone-scene',
        backdrop: 'navy',
        tabs: [
          {
            name: 'Request',
            layout: 'gallery',
            description: [
              'This page allows employees to request shifts for upcoming weeks in a simple and intuitive way.',
              'Instead of memorizing shift codes and entering them manually, users can select their preferred shifts directly from the interface and indicate their priority level for each request. This streamlines the process, reduces errors, and makes shift planning faster and more user-friendly.',
            ],
            images: [
              '/assets/iaa-weekly-shifts.webp',
              '/assets/iaa-weekly-shifts-1.webp',
              '/assets/iaa-weekly-shifts-2.webp',
              '/assets/iaa-weekly-shifts-3.webp',
              '/assets/iaa-weekly-shifts-4.webp',
              '/assets/iaa-weekly-shifts-5.webp',
            ],
          },
          {
            name: 'Exchange',
            layout: 'gallery',
            description: [
              'The Exchange Shifts feature allows employees to easily swap shifts with their colleagues when their schedule changes.',
              'Users can select the shift they would like to exchange and browse alternative shift options suggested by other employees. To make the process faster and more efficient, shifts can be filtered by date or shift code.',
              'Once a user submits a swap request, the selected colleague receives a notification and can choose whether to accept or decline the exchange.',
              'This feature gives employees greater flexibility while reducing the need for manual coordination through HR or external communication channels.',
            ],
            images: [
              '/assets/iaa-switch-shifts.webp',
              '/assets/iaa-switch-shifts-1.webp',
              '/assets/iaa-switch-shifts-2.webp',
              '/assets/iaa-switch-shifts-3.webp',
              '/assets/iaa-switch-shifts-4.webp',
              '/assets/iaa-switch-shifts-5.webp',
              '/assets/iaa-switch-shifts-6.webp',
            ],
          },
        ],
      },
      {
        title: 'Settings & HR Requests',
        tagline: 'Replacing paper forms and fragmented communication with a self-service employee experience.',
        description: [
          'The Settings and HR Requests sections were designed to simplify common administrative tasks and reduce the need for manual paperwork.',
          'Through a single, centralized interface, employees can submit requests directly to HR, including shift changes, leave requests, updates to personal information, address changes, bank details, and other employment-related updates.',
          'Each request follows a guided flow, allowing users to provide the required information, attach supporting documents when needed, and submit everything digitally. Once a request is submitted, employees receive confirmation that it has been successfully sent for review.',
          'By digitizing these processes, the experience becomes faster, more transparent, and significantly more convenient for both employees and HR teams.',
        ],
        layout: 'phone-scene',
        backdrop: 'navy',
        images: [
          '/assets/iaa-hr.webp',
          '/assets/iaa-settings.webp',
          '/assets/iaa-settings-name.webp',
          '/assets/iaa-settings-name-full.webp',
          '/assets/iaa-settings-name-saved.webp',
        ],
      },
    ],
    reflection: [
      'This project was especially meaningful to me because, at the time, I was an employee of the Israel Airports Authority myself. Having firsthand experience with the existing processes gave me a deep understanding of the challenges employees faced on a daily basis.',
      'Every screen and user flow was carefully designed with the goal of creating the most effective and intuitive solution possible. To better understand user needs and priorities, I conducted interviews with managers, colleagues, and friends, gathering insights from different perspectives across the organization.',
      'This research helped ensure that the final concept addressed real pain points while balancing both employee and organizational needs.',
    ],
    questionnaire: {
      title: 'Questionnaire Analysis',
      subtitle: "Based on 100+ employees' answers",
      items: [
        {
          type: 'donut',
          question:
            'How satisfied are you with your work interface with the HR/Bosovona system? From 1 -5',
          segments: [
            { label: '1', value: 43.3, color: '#171a2d' },
            { label: '2', value: 24.8, color: '#2d3359' },
            { label: '3', value: 28.7, color: '#b0cbe8' },
            { label: '4', value: 3.2, color: '#fff5c1', chipOffset: { x: -10 } },
            { label: '5', value: 0, color: '#fcf9e7', chipOffset: { x: 10 } },
          ],
        },
        {
          type: 'donut',
          question:
            'How many times a week do you use the system? 1 (once) - 5 (almost every day)',
          segments: [
            { label: '1', value: 2.5, color: '#fcf9e7', chipOffset: { x: -5 } },
            { label: '2', value: 1.9, color: '#fff5c1', chipOffset: { x: 15 } },
            { label: '3', value: 2.5, color: '#b0cbe8', chipOffset: { x: 5, y: 20 } },
            { label: '4', value: 13.4, color: '#2d3359', chipOffset: { x: 10, y: 30 } },
            { label: '5', value: 79.6, color: '#171a2d' },
          ],
        },
        {
          type: 'percents',
          stats: [
            {
              question: 'Would you like the work arrangement to become more accessible?',
              highlight: 'YES',
              value: '100%',
            },
            {
              question: 'Would you download an app where you can communicate with HR?',
              highlight: 'YES',
              value: '97.5%',
            },
          ],
        },
      ],
    },
    gallery: [],
  },
  {
    slug: 'israeli-scouts',
    tag: 'Web & Mobile App',
    banner: '/assets/scouts-banner.png',
    bannerAspect: '2562 / 756',
    bannerShift: 0,
    bannerFit: 'contain',
    bannerOffsetY: -20,
    logos: [{ label: 'Israeli Scouts', src: '/assets/scouts-logo-hebrew.png' }],
    image: '/assets/scouts-card-screenshot.webp',
    shortName: 'Israeli Scouts',
    title: "Israeli Scouts' new portal",
    body: 'A new system that makes it easier for parents to register their children for Scout activities such as summer camps, seminars and trips.',
    csBody: [
      'The Israeli Scouts (“Tzofim”) is the country’s largest youth movement, with tens of thousands of parents registering their children for camps, seminars, trips, and seasonal activities every year. The existing system worked, but the experience didn’t.',
      'Registration ran as a heavy data-entry forms inside a chat metaphor. Parents with more than one child had no overview, repeated the same steps again and again, and routinely missed deadlines. I redesigned it as a calm self-service portal and built the new flow as a real, interactive prototype rather than static mockups.',
    ],
    demoUrl: '/work/israeli-scouts/demo',
    demoNote:
      'Explore the complete parent journey — from registration and activity discovery to approvals, payment, and confirmation.',
    problemLabel: 'The problem',
    problemWide: true,
    problem: [
      "Although a registration portal already existed, For Israel's largest youth movement, the registration experience felt surprisingly outdated.",
      'The experience lacked clear structure, making it difficult to understand what actions needed attention, which activities were available, and where users were in the registration process. Small typography, low-visibility CTAs, and information-dense screens created a cluttered experience that was hard to scan and navigate.',
      'For families with multiple children, managing registrations became even more complex. Parents had no simple way to view all relevant activities, track registrations, or stay on top of upcoming deadlines in one place.',
      'What should have been a straightforward self-service experience felt overwhelming, disorganized, and unintuitive.',
    ],
    todayLabel: 'How it works today',
    today: [
      { src: '/assets/scouts-portal-m1.webp' },
      { src: '/assets/scouts-portal-m2.webp' },
      { src: '/assets/scouts-portal-m3.webp' },
      { src: '/assets/scouts-portal-m4.webp' },
      { src: '/assets/scouts-portal-m5.webp' },
      { src: '/assets/scouts-portal-m6.webp' },
    ],
    todayCaption: 'Mobile',
    todayDesktop: [
      '/assets/scouts-portal-d1.webp',
      '/assets/scouts-portal-d2.webp',
      '/assets/scouts-portal-d3.webp',
      '/assets/scouts-portal-d4.webp',
    ],
    todayDesktopCaption: 'Desktop',
    solutionLabel: 'The redesign',
    solution: [
      'I redesigned the experience around a simple goal: give parents clarity, control, and confidence throughout the registration process.',
      'Instead of forcing parents to navigate a fragmented and information-heavy experience, I introduced a centralized self-service portal that organizes the entire journey in one place. From the moment parents log in, they can easily see what activities are available, which actions require attention, and what has already been completed.',
      "The new experience is structured around the family rather than individual registrations. Parents can manage multiple children from a single account, view activities relevant to each child's scout group, track upcoming deadlines, and complete registrations without repeatedly entering the same information.",
      'To reduce cognitive load, activity details, pricing, discounts, and registration statuses are surfaced upfront, allowing parents to make informed decisions quickly. A streamlined cart and checkout flow consolidates registrations, approvals, and payments into a single experience, while automatically applying member and sibling discounts along the way.',
      'The result is a registration experience that feels organized, transparent, and intuitive transforming a frustrating administrative task into a simple self-service journey for families.',
    ],
    screensLabel: 'The new portal',
    gallery: [],
    newScreens: [
      {
        title: 'Log in & Events Overview',
        description: [
          'Parents access the portal through a simple login flow using either their ID and password or a one-time SMS verification code. The experience is designed to be familiar and frictionless, with a single focused login card placed over branded Scouts imagery. Clear visual hierarchy, minimal inputs, and a prominent primary action help parents get in quickly without unnecessary steps.',
          'Once logged in, parents land on a centralized dashboard that brings all relevant information together in one place. A persistent navigation menu provides quick access to activities, family members, registration history, support.',
          'The dashboard highlights upcoming registered activities at the top, ensuring parents can immediately see what’s next for their child. Below, open registration opportunities are presented as detailed cards that include activity type, location, dates, registration deadlines, and pricing. This allows parents to make informed decisions without searching through emails, messages, or external documents.',
          'The overall experience was designed to simplify activity management, increase transparency around registrations, and give families a clear, organized view of their scouting journey.',
          {
            images: [
              '/assets/scouts-portal-login.webp',
              { src: '/assets/scouts-portal-login-mobile.webp', width: 138, offsetX: -520, offsetY: 40 },
              { src: '/assets/scouts-portal-dashboard.webp', offsetX: -140 },
              { src: '/assets/scouts-portal-dashboard-mobile.webp', width: 138, offsetX: -660, offsetY: 40 },
            ],
          },
        ],
      },
      {
        title: 'Checkout',
        description: [
          '#### Registration & Checkout Flow',
          'To simplify the registration process for families while reducing administrative workload, the experience was designed around a familiar e-commerce pattern: browse, add to cart, review, approve, and pay.',
          'Parents can register multiple children for multiple activities in a single session. As activities are selected, they are added to a registration cart that remains accessible throughout the experience. The cart provides a clear overview of all selected activities, grouped by child, along with pricing, discounts, and the total amount due. This allows parents to review and manage registrations before proceeding to checkout.',
          'Before payment, parents are guided through a dedicated approval step for each kid. Rather than relying on paper forms or manual approvals, all required information is collected digitally within the flow. Depending on the activity, parents can provide medical information, dietary restrictions, transportation preferences, emergency details, participation approvals, and media consent. A digital signature is required to confirm acceptance of the activity terms and ensure all necessary permissions are collected before registration is completed.',
          'Once approvals are submitted, parents proceed to payment through a secure checkout experience. The registration summary remains visible throughout the process, giving parents full transparency over the activities, discounts, and final payment amount. A clear step indicator helps users understand where they are in the process and what remains before completion.',
          'After payment is successfully processed, families are taken to a confirmation screen that provides immediate reassurance that the registration was completed successfully. The screen summarizes the registered activities and informs parents that additional details and confirmations have been sent via SMS and email, eliminating uncertainty and reducing follow-up inquiries to staff.',
          'By consolidating registration, approvals, and payment into a single digital flow, the experience replaces fragmented manual processes with a simple, transparent, and parent-friendly journey.',
          {
            gallery: true,
            images: [
              '/assets/scouts-portal-checkout.webp',
              '/assets/scouts-portal-checkout1.webp',
              '/assets/scouts-portal-checkout2.webp',
              '/assets/scouts-portal-checkout-payment.webp',
              '/assets/scouts-portal-checkout-thankyou.webp',
            ],
          },
          {
            images: [
              { src: '/assets/scouts-portal-checkout-mobile.webp', width: 208 },
              { src: '/assets/scouts-portal-checkout1-mobile.webp', width: 208 },
              { src: '/assets/scouts-portal-payment-mobile.webp', width: 208 },
              { src: '/assets/scouts-portal-thankyou-mobile.webp', width: 208 },
              { src: '/assets/scouts-portal-co-mobile.webp', width: 208 },
            ],
          },
        ],
      },
      {
        title: 'My Family',
        description: [
          "The My Family section serves as the central place for parents to manage household information and keep their children's records up to date.",
          'Parents can view all registered family members in a single, organized dashboard, including both children and guardians. Each child record displays key information such as scouting tribe, grade, school, birth date, and membership status, allowing parents to quickly verify that information is accurate before registering for activities.',
          'To accommodate growing families and changing circumstances, parents can easily add, edit, or remove family members directly within the portal. Adding a new child is handled through a guided form that collects all relevant information in one place, including personal details, tribe affiliation, school, grade, contact information, and emergency details. This eliminates the need to contact local administrators or submit manual paperwork whenever family information changes.',
          'By centralizing family management, the portal creates a single source of truth that supports the entire registration experience. Once a child is added, their information automatically flows into activity registration, approvals, and payment processes, reducing repetitive data entry and making future registrations significantly faster for parents.',
          {
            images: [
              '/assets/scouts-portal-family.webp',
              { src: '/assets/scouts-portal-family-mobile.webp', width: 138, offsetX: -520, offsetY: 40 },
              { src: '/assets/scouts-portal-newfamily.webp', offsetX: -140 },
              { src: '/assets/scouts-portal-newfamily-mobile.webp', width: 138, offsetX: -660, offsetY: 40 },
            ],
          },
        ],
      },
      {
        title: 'Registration History',
        description: [
          'Registration History section gives parents a complete overview of all past and upcoming activity registrations in one place.',
          'Instead of searching through emails, payment confirmations, or WhatsApp messages, parents can quickly review every registration made for their children, including activity details, participant name, season, registration date, payment amount, and current status. Filters allow parents to narrow results by child, year, payment status, or registration status, making it easy to find specific records even years later.',
          'To improve transparency, each registration clearly displays its status whether it is upcoming, completed, canceled, or refunded, allowing parents to understand the current state of every activity at a glance.',
          "The page also includes a dedicated Credits & Refunds section that tracks reimbursements, discounts, and account credits separately from activity registrations. By surfacing both expenses and credits in a single view, parents gain a clearer understanding of their family's financial activity and can easily verify past payments, refunds, and outstanding balances.",
          'This section was designed to eliminate uncertainty, reduce support inquiries, and provide families with a reliable record of their scouting activity history and related transactions.',
          {
            images: [
              '/assets/scouts-portal-history1.webp',
              { src: '/assets/scouts-portal-history1-mobile.webp', width: 138, offsetX: -520, offsetY: 40 },
              { src: '/assets/scouts-portal-history2.webp', offsetX: -140 },
              { src: '/assets/scouts-portal-history2-mobile.webp', width: 138, offsetX: -660, offsetY: 40 },
            ],
          },
        ],
      },
      {
        title: 'Contact Page',
        description: [
          'Contact Page provides parents with a direct and structured way to communicate with their local Scout tribe without relying on phone calls, emails, or messaging groups.',
          "To make support more personal and approachable, the page prominently displays the contact details of the family's tribe coordinator, including their name, role, phone number, email address, and branch location. This gives parents confidence that they know exactly who is handling their request and how to reach them if needed.",
          'For non-urgent inquiries, parents can submit a support request directly through the portal. The form automatically associates the request with the relevant tribe, parent, and child, reducing manual effort and ensuring the inquiry reaches the correct staff member. Parents simply select the relevant child, choose the topic of the request, and provide their message.',
          'After submission, the system provides immediate confirmation that the inquiry has been received and informs parents when they can expect a response. This feedback loop eliminates uncertainty and reassures families that their request is being handled.',
          'By centralizing communication within the portal, the experience reduces administrative overhead, creates a clear support channel for parents, and strengthens the connection between families and their local Scout community.',
          {
            images: [
              '/assets/scouts-portal-contact.webp',
              { src: '/assets/scouts-portal-contact-sent.webp', offsetX: 16 },
              { src: '/assets/scouts-portal-contact-sent-mobile.webp', width: 138, offsetX: -504, offsetY: 40 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'skeep',
    tag: 'B2B SaaS System',
    banner: '/assets/skeep-banner.webp',
    logos: [{ label: 'Skeep', src: '/assets/skeep-logo.png' }],
    image: '/assets/skeep-screenshot-v3.png',
    title: 'Convert visitors into engaged shoppers,\nfully automated.',
    cardTitle: 'Convert visitors into engaged shoppers, fully automated.',
    shortName: 'Skeep',
    body: 'Generative AI platform that automatically creates interactive experiences to convert visitors into customers.',
    csBody: [
      "Skeep’s mission is to transform any eCommerce store into a fully automated-guided shopping experience.",
      'Skeep helps consumer brands to automate eCommerce experience, boost zero-party data collection, and uplift product recommendation.',
      'Skeep develops an AI-based platform that automatically scans, analyzes, and creates interactive shopping personalized experiences for each consumer and their needs.',
      'Our platform combines groundbreaking AI technology, your product & user’s data and creates personalized and branded interactive experiences in a snap.',
    ],
    problem: {
      bullets: [
        {
          lead: 'CPG brands need first-party data to survive',
          text: '\nBy 2023, marketers will no longer be able to track customers using third-party cookies.',
        },
        {
          lead: 'No cookies? Big problem.',
          text: '\n“61% of high-growth brands are shifting to a first-party strategy”.',
          cite: 'Deloitte Insights, 2022 Global Marketing Trends',
        },
        {
          lead: 'So many brands need our help',
          text: '\n“Less than 25% of brands are successfully investing in user engagement and personalization”.',
          cite: 'The state of personalization 2021',
        },
        {
          lead: 'The current “solutions” don’t work.',
          text: '\nCPG and beauty brands need a tool that’s designed for their unique needs and customer journeys.',
        },
      ],
    },
    solution:
      'Skeep helps you collect, own and leverage your customer and market first party data to create personalized shopping experiences that drive revenue, uplift AOV and increase sales.',
    solutionImage: '/assets/skeep-how-it-works.webp',
    solutionImageAlt: 'Skeep — how it works',
    screensLabel: 'The System',
    newScreens: [
      {
        title: 'Onboarding',
        description: [
          'For new users, the platform can feel overwhelming at first due to its wide range of capabilities. To help users get started quickly, I designed a guided onboarding flow that introduces the platform and simplifies the quiz creation process.',
          'The onboarding consists of four simple steps:',
          {
            variant: 'timeline-zigzag-pill',
            steps: [
              {
                name: '1. Setup',
                description: [
                  'Choose how the quiz will be displayed on the store and select the relevant product collection.',
                ],
                layout: 'gallery',
                images: [
                  { src: '/assets/skeep-onboarding-1.webp', alt: 'Skeep sign-in screen' },
                  { src: '/assets/skeep-onboarding-2.webp', alt: 'Skeep onboarding — Setup step (1/2)' },
                  { src: '/assets/skeep-onboarding-3.webp', alt: 'Skeep onboarding — Setup step (2/2)' },
                ],
              },
              {
                name: '2. Branding',
                description: [
                  'Customize the quiz’s colors and images to match the brand’s visual identity.',
                ],
                images: [
                  { src: '/assets/skeep-onboarding-4.webp', alt: 'Skeep onboarding — Branding step', width: 585, height: 355 },
                ],
                flip: false,
              },
              {
                name: '3. Content Creation',
                description: [
                  'Edit the first question and answer. Based on this input, the system automatically generates additional questions that can be refined later.',
                ],
                images: [
                  { src: '/assets/skeep-onboarding-5.webp', alt: 'Skeep onboarding — Content Creation step', width: 585, height: 355 },
                ],
              },
              {
                name: '4. Product Mapping',
                description: [
                  'Connect products to each answer to ensure accurate and personalized recommendations.',
                ],
                images: [
                  { src: '/assets/skeep-onboarding-6.webp', alt: 'Skeep onboarding — Product Mapping step', width: 585, height: 355 },
                ],
                flip: false,
              },
            ],
          },
          'Once the user clicks **Finish**, the platform automatically generates a complete questionnaire and redirects them to the Experience page, where they can review, edit, and publish it.',
          'Users who prefer to skip the onboarding can go directly to the dashboard and create questionnaires from scratch.',
        ],
      },
      {
        title: 'Home page / Experiences page',
        description: [
          'The Experiences page serves as the platform’s main dashboard, providing users with a centralized view of all their interactive shopping experiences. From this page, users can quickly monitor each experience, including its type, status, implementation method, and placement on their website.',
          'The page was designed to make experience management simple and efficient, allowing users to create, edit, preview, publish, and manage multiple experiences from a single location.',
          '#### Key Actions',
          {
            scrollItems: {
              defaultImage: '/assets/skeep-experiences-page-2.webp',
              items: [
                {
                  name: 'Create an Experience',
                  description:
                    'Users can create new quizzes and shopping experiences based on the limits of their subscription plan.',
                },
                {
                  name: 'Edit Experience',
                  description:
                    'Opens the experience editor, where users can update content, design, questions, recommendations, and settings.',
                },
                {
                  name: 'Preview',
                  description:
                    'Allows users to see exactly how the experience will appear on their live website before publishing.',
                },
                {
                  name: 'Go Live',
                  description:
                    'Publishes the experience immediately, making it available to shoppers on the store.',
                },
                {
                  name: 'View Related Products',
                  description:
                    'Displays all products connected to a specific experience, helping users understand and manage their recommendation logic.',
                },
                {
                  name: 'Implementation Type & Placement',
                  description:
                    'Users can control how and where each experience appears on their website. Available implementation methods include:',
                  bullets: [
                    'Embedded Page',
                    'Pop-up',
                    'Banner (Pro Plan)',
                    'Product Grid (Pro Plan)',
                  ],
                  outro:
                    'This flexibility allows brands to seamlessly integrate experiences into different stages of the customer journey while maintaining full control over placement and visibility.',
                  // sticky image cycles through these every 5s while active
                  images: [
                    '/assets/skeep-experiences-page-3.webp',
                    '/assets/skeep-experiences-page-4.webp',
                    '/assets/skeep-experiences-page-5.webp',
                  ],
                  cycleMs: 5000,
                },
                {
                  name: 'Products Mapping',
                  description: [
                    'The Product Mapping page allows users to manage the products connected to each experience and control the logic behind personalized recommendations.',
                    'Every product is associated with a **Product Type** and a set of **Tags**. These tags play a key role in the recommendation engine, connecting customer answers to the most relevant products. As shoppers interact with a quiz, their responses are matched against product tags to generate personalized recommendations.',
                    'Users can easily manage their product catalog directly from this page, including:',
                  ],
                  bullets: [
                    'Adding, editing, or removing products',
                    'Changing product types',
                    'Creating, editing, or deleting tags',
                    'Re-syncing products from the connected store',
                    'Managing product-to-tag relationships',
                  ],
                  outro: [
                    'To support stores with large inventories, the page also includes advanced filtering options, allowing users to quickly find products by **name**, **product type**, **product ID**, or **tags**.',
                    'This centralized management experience gives brands full control over their recommendation logic while making product maintenance simple and scalable.',
                  ],
                  // sticky image cycles through these every 5s while active
                  images: [
                    '/assets/skeep-product-mapping-1.webp',
                    '/assets/skeep-product-mapping-2.webp',
                    '/assets/skeep-product-mapping-3.webp',
                    '/assets/skeep-product-mapping-4.webp',
                  ],
                  cycleMs: 5000,
                },
              ],
            },
          },
        ],
      },
      {
        title: 'Experience Editor',
        description: [
          'The Experience Editor is the core workspace where users can create, customize, and manage every aspect of their interactive shopping experience. From content and design to product recommendations and lead collection, all configuration is handled through a single, intuitive interface.',
          'Users can preview their changes in real time, switch between desktop and mobile views, and publish updates whenever they are ready.',
          '#### Intro',
          'The Intro section allows users to create an optional welcome screen before the quiz begins. Here, they can customize the title, supporting text, call-to-action button, and images to introduce the experience and encourage shoppers to start the quiz.',
          {
            images: [
              { src: '/assets/skeep-intro-content.webp', alt: 'Skeep Intro Quiz — Content', width: 585, height: 355 },
              { src: '/assets/skeep-intro-design.webp', alt: 'Skeep Intro Quiz — Design', width: 585, height: 355 },
            ],
          },
          '#### Experience',
          {
            sideBySide: {
              variant: 'stack',
              text: [
                'This section contains the main quiz builder and gives users full control over the customer journey.',
                'Users can:',
                {
                  bullets: [
                    'Create and edit questions from scratch',
                    'Manage answers and supporting images',
                    'Select different question types',
                    'Connect products to specific answers for personalized recommendations',
                    'Customize colors, typography, buttons, and answer styles to match their brand',
                  ],
                },
              ],
              images: [
                { src: '/assets/skeep-experience-content-1.webp', alt: 'Skeep Experience Editor — Content 1' },
                { src: '/assets/skeep-experience-content-2.webp', alt: 'Skeep Experience Editor — Content 2' },
                { src: '/assets/skeep-experience-content-3.webp', alt: 'Skeep Experience Editor — Content 3' },
                { src: '/assets/skeep-experience-content-4.webp', alt: 'Skeep Experience Editor — Content 4' },
                { src: '/assets/skeep-experience-content-5.webp', alt: 'Skeep Experience Editor — Content 5' },
              ],
            },
          },
          { heading: 'Email Collection', offsetTop: 50 },
          {
            sideBySide: {
              text: [
                'The Email Collection section enables brands to capture customer email addresses before displaying recommendations.',
                'Collected emails can be used for:',
                {
                  bullets: [
                    'Sending personalized product recommendations',
                    'Promotional campaigns and special offers',
                    'Building customer lists and gathering zero-party data',
                    'Improving post-quiz engagement and retention',
                  ],
                },
              ],
              images: [
                { src: '/assets/skeep-email-collection.webp', alt: 'Skeep — Email Collection screen', offsetX: 80, offsetY: -70, width: 585, height: 355 },
              ],
            },
          },
          { heading: 'Results Page', offsetTop: -20 },
          {
            sideBySide: {
              text: [
                'The Results Page allows users to customize the final recommendation screen presented to shoppers after completing the quiz.',
                'Users can control how recommended products are displayed, edit supporting content and messaging, and design the page to match their brand experience. This ensures customers receive clear, personalized recommendations while creating a seamless path toward purchase.',
              ],
              images: [
                { src: '/assets/skeep-results-page.webp', alt: 'Skeep — Results Page screen', offsetX: 80, offsetY: -60, width: 585, height: 355 },
              ],
            },
          },
        ],
      },
      {
        kind: 'label',
        label: 'Preview Experience on Website',
        images: [
          { src: '/assets/skeep-quize-mobile.webp', alt: 'Skeep QuizE — Mobile preview', caption: 'Mobile' },
          { src: '/assets/skeep-quize-desktop.webp', alt: 'Skeep QuizE — Desktop preview', caption: 'Desktop' },
        ],
      },
      {
        title: 'Analytics',
        description: [
          'The Analytics section transforms customer interactions into actionable insights, helping brands understand how shoppers engage with their experiences and what drives purchasing decisions.',
          'The main dashboard provides a comprehensive overview of performance, including published experiences, total engagements, collected emails, average time spent, engagement rates, conversion rates, revenue, and average order value. Users can also analyze performance by device, page, implementation type, and date range to identify trends and optimization opportunities.',
          {
            images: [
              { src: '/assets/skeep-analytics-1.webp', alt: 'Skeep — Analytics dashboard overview', width: 585, height: 355 },
              { src: '/assets/skeep-analytics-2.webp', alt: 'Skeep — Analytics dashboard detail', offsetX: 30, width: 585, height: 355 },
            ],
          },
          'In addition to performance metrics, the platform provides deeper customer insights by visualizing how shoppers respond to each quiz question. Users can explore answer distributions, identify popular tags and customer preferences, and discover which products are most frequently recommended or purchased.',
          'By combining behavioral data, customer insights, and recommendation performance, brands can make more informed decisions, optimize their experiences, improve product recommendations, and ultimately increase engagement, conversions, and revenue.',
        ],
      },
      {
        title: 'Settings',
        description: [
          'The Settings section provides users with a centralized place to manage their account, team, integrations, and subscription. It was designed to give brands full control over their workspace while keeping configuration simple and accessible.',
          '#### Account',
          {
            sideBySide: {
              text: [
                'The Account section allows users to manage their personal and company information, update account details, and configure general workspace settings.',
              ],
              images: [
                { src: '/assets/skeep-settings-account.webp', alt: 'Skeep Settings — Account', offsetX: 80, offsetY: -60, width: 585, height: 355 },
              ],
            },
          },
          '#### Integrations',
          {
            sideBySide: {
              text: [
                'The Integrations page enables users to connect Skeep with the tools they already use. Connected integrations help synchronize customer data, automate workflows, and extend the platform’s capabilities.',
                'Users can connect, manage, or disconnect integrations such as:',
                {
                  bullets: [
                    'Shopify',
                    'Klaviyo',
                    'Mailchimp',
                    'WooCommerce',
                    'Flashy',
                  ],
                },
                'This allows brands to seamlessly transfer customer data, collect leads, and create a unified eCommerce ecosystem.',
              ],
              images: [
                { src: '/assets/skeep-settings-integrations.webp', alt: 'Skeep Settings — Integrations', offsetX: 80, offsetY: -60, width: 585, height: 355 },
              ],
            },
          },
          '#### User Management',
          {
            sideBySide: {
              variant: 'stack',
              stackOffsetY: -60,
              text: [
                'The User Management section allows account owners to manage team members and collaborate within the platform.',
                'Users can:',
                {
                  bullets: [
                    'Invite new team members',
                    'View member status',
                    'Resend invitations',
                    'Remove users from the workspace',
                  ],
                },
                'The number of available seats is determined by the subscription plan.',
              ],
              images: [
                { src: '/assets/skeep-settings-userm.webp', alt: 'Skeep Settings — User Management overview' },
                { src: '/assets/skeep-settings-userm-1.webp', alt: 'Skeep Settings — User Management detail 1' },
                { src: '/assets/skeep-settings-userm-2.webp', alt: 'Skeep Settings — User Management detail 2' },
              ],
            },
          },
          '#### Plans & Billing',
          {
            sideBySide: {
              text: [
                'The Plans section provides an overview of the current subscription, usage limits, and available upgrades.',
                'Users can compare plans, review included features, monitor usage, and upgrade or downgrade their subscription based on their business needs.',
              ],
              images: [
                { src: '/assets/skeep-settings-plans.webp', alt: 'Skeep Settings — Plans & Billing', offsetX: 80, offsetY: -60, width: 585, height: 355 },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    slug: 'oddity',
    comingSoon: true,
    tag: 'e-Commerce',
    banner: '/assets/banner-placeholder.webp',
    logos: [
      { label: 'Oddity', src: '/assets/oddity-logo.png' },
      { label: 'IL Makiage', src: '/assets/ilmakiage-logo.png' },
    ],
    image: '/assets/ilm-screenshot.png',
    title: 'Consumer-tech company built to transform the global beauty and wellness market.',
    cardTitle: 'Transforming beauty and wellness through technology.',
    shortName: 'Oddity',
    banner: '/assets/oddity-banner.png',
    bannerAspect: '6336 / 1584',
    bannerShift: 0,
    bannerFit: 'contain',
    csBody: [
      'Defining and building the future of beauty through proprietary technology that connects people with superior products fit for them. We are shifting millions of customers offline to online, and are the fastest-growing beauty brand in the US.',
      'Oddity design entirely new consumer experiences, powered by ODDITY’s unified data and technology infrastructure, that allow us to solve pain points created by outdated processes and conventional thinking. We build DTC platforms that learn from our users. We deploy algorithms and machine learning models that leverage user data and deliver a precise product match.',
    ],
    body: 'Design entirely new consumer experiences, powered by ODDITY’s unified data and technology infrastructure, that allow us to solve pain points created by outdated processes and conventional thinking.',
    problemLabel: 'Quiz Flow',
    problem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    todayLabel: 'Redesign Result Page',
    today: [],
    solutionLabel: 'Checkout',
    solution: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    screensLabel: 'Return Portal',
    gallery: [],
    extraSections: [
      {
        label: 'Website',
        paragraphs: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
      },
    ],
  },
]

export const getProject = (slug) => projects.find((p) => p.slug === slug)
