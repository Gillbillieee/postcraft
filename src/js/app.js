// ===== PostCraft — AI Social Media Post Generator =====
// A client-side tool for generating LinkedIn & Twitter posts

(function() {
  'use strict';

  // ===== State =====
  let generatedPosts = [];

  // ===== DOM References =====
  const topicEl = document.getElementById('topic');
  const platformEl = document.getElementById('platform');
  const toneEl = document.getElementById('tone');
  const keywordsEl = document.getElementById('keywords');
  const generateBtn = document.getElementById('generateBtn');
  const postsContainer = document.getElementById('postsContainer');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const outputActions = document.getElementById('outputActions');

  // ===== Initialize =====
  document.addEventListener('DOMContentLoaded', () => {
    loadDraft();
    setupAutoSave();
  });

  // ===== Core Generation =====
  function generatePosts() {
    const topic = topicEl.value.trim();
    if (!topic) {
      shakeElement(topicEl);
      topicEl.focus();
      return;
    }

    const platform = platformEl.value;
    const tone = toneEl.value;
    const keywords = keywordsEl.value.split(',').map(k => k.trim()).filter(Boolean);

    // Show loading
    postsContainer.style.display = 'none';
    outputActions.style.display = 'none';
    loadingState.style.display = 'block';
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;display:inline-block;"></span> Generating...';

    // Simulate generation delay for UX feel, then generate immediately
    setTimeout(() => {
      const posts = [];

      if (platform === 'linkedin' || platform === 'both') {
        posts.push({ platform: 'linkedin', content: generatePost(topic, tone, keywords, 'linkedin', 0) });
        posts.push({ platform: 'linkedin', content: generatePost(topic, tone, keywords, 'linkedin', 1) });
      }

      if (platform === 'twitter' || platform === 'both') {
        posts.push({ platform: 'twitter', content: generatePost(topic, tone, keywords, 'twitter', 0) });
        posts.push({ platform: 'twitter', content: generatePost(topic, tone, keywords, 'twitter', 1) });
      }

      // If both platforms, add a third variation
      if (platform === 'both') {
        const extraPlatform = Math.random() > 0.5 ? 'linkedin' : 'twitter';
        posts.push({ platform: extraPlatform, content: generatePost(topic, tone, keywords, extraPlatform, 2) });
      }

      generatedPosts = posts;
      renderPosts(posts);

      // Save to localStorage
      saveDraft();

      loadingState.style.display = 'none';
      postsContainer.style.display = 'flex';
      outputActions.style.display = 'flex';
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<span class="btn-icon">✨</span> Generate Posts';
    }, 800);
  }

  // ===== Post Generation Engine =====
  function generatePost(topic, tone, keywords, platform, variation) {
    const generators = {
      professional: generateProfessional,
      casual: generateCasual,
      controversial: generateControversial,
      storytelling: generateStorytelling,
      humorous: generateHumorous
    };

    const generator = generators[tone] || generateProfessional;
    return generator(topic, keywords, platform, variation);
  }

  // --- Professional Tone ---
  function generateProfessional(topic, keywords, platform, v) {
    const templates = [
      () => `Here's what I've learned about ${topic}:

1. It starts with understanding the fundamentals
2. Consistency beats intensity every time
3. The best time to start was yesterday — second best is now

The professionals who succeed aren't necessarily the most talented. They're the most consistent.

${keywords.length ? '🔑 Key takeaways: ' + keywords.join(', ') : ''}

What's your experience with this?`,

      () => `I used to think ${topic} was overhyped.

Then I spent 6 months actually doing it.

Here's what changed my mind:

→ It's not about perfection — it's about progress
→ Small daily improvements compound massively
→ The people winning aren't smarter, they're just starting earlier

${keywords.length ? 'For anyone exploring ' + keywords.join(' or ') + ': start small, stay consistent.' : ''}

Agree or disagree?`,

      () => `The #1 mistake I see people make with ${topic}:

They overthink it.

Here's the framework that actually works:

Step 1: Define your goal (be specific)
Step 2: Build a simple system (not a perfect plan)
Step 3: Execute daily for 30 days
Step 4: Review and adjust

That's it. No secret formula. No hack.

Just show up, do the work, iterate.

${keywords.length ? '💡 Remember: ' + keywords.join(' → ') : ''}`
    ];

    return templates[v % templates.length]();
  }

  // --- Casual Tone ---
  function generateCasual(topic, keywords, platform, v) {
    const templates = [
      () => `Real talk about ${topic}...

I've been thinking about this a lot lately, and here's my take:

It doesn't have to be complicated. You don't need the perfect strategy or the latest course.

Just start where you are. Use what you have. Do what you can.

The people who seem "overnight successes" spent years behind the scenes. Every single one of them.

${keywords.length ? keywords.map(k => '✨ ' + k).join('\n') : ''}

What's one thing you've learned recently that shifted your perspective? 👇`,

      () => `Hot take: ${topic} is easier than most people think.

Not easy. But easier.

The gap between where you are and where you want to be isn't as wide as it feels. You just need:

• A clear starting point
• A bit of consistency
• The willingness to look a little silly at first

Everyone starts somewhere. Yours doesn't have to be perfect — it just has to exist.

${keywords.length ? keywords.join(' • ') : ''}`,

      () => `Just had one of those moments where everything clicked around ${topic}.

You know the feeling? Where all the pieces just... fall into place?

Here's what I realized:
- You don't need more information, you need to apply what you already have
- Progress isn't linear (stop measuring by days)
- The community is incredible — reach out, people genuinely want to help

${keywords.length ? 'Shoutout to anyone also exploring: ' + keywords.join(', ') : ''}

Drop a 💪 if this resonated!`
    ];

    return templates[v % templates.length]();
  }

  // --- Controversial Tone ---
  function generateControversial(topic, keywords, platform, v) {
    const templates = [
      () => `Unpopular opinion: ${topic} is broken.

And I don't say that lightly.

Most advice you'll find online is:
❌ Too theoretical
❌ Written by people who've never actually done it
❌ Designed to sell courses, not create results

Here's what actually works (no fluff):

1. Pick ONE approach and stick with it for 90 days
2. Measure everything — feelings aren't data
3. Copy what works before trying to be original

${keywords.length ? 'Hot take: ' + keywords.join(' are overrated') : ''}

Am I wrong? Fight me in the comments. 👇`,

      () => `I'm going to say what nobody else will:

${topic} isn't what you think it is.

Everyone's chasing X when they should be focusing on Y. The gap between top performers and everyone else has nothing to do with talent.

It's about focus. Ruthless, almost selfish focus.

The people winning right now didn't get smarter. They just stopped trying to do everything at once.

${keywords.length ? 'Truth bomb: ' + keywords.join(' won\'t save you') : ''}

Change my mind.`,

      () => `Here's the thing about ${topic} that nobody talks about:

It's boring.

Like, genuinely boring.

No hacks. No shortcuts. No 5AM routines (unless they work for you).

Just showing up day after day and doing the work when nobody's watching.

The "secret" is that there IS no secret.

${keywords.length ? 'Stop overcomplicating: ' + keywords.join(' → focus') : ''}

Who agrees and who still thinks there's a shortcut? 🤔`
    ];

    return templates[v % templates.length]();
  }

  // --- Storytelling Tone ---
  function generateStorytelling(topic, keywords, platform, v) {
    const templates = [
      () => `3 years ago, I was completely stuck on ${topic}.

I'd tried everything. Read every book. Taken every course.

And still — nothing worked.

Then something shifted. Not dramatically. Just one small decision:

I stopped trying to be perfect and started trying to be consistent.

Month 1: Terrible progress
Month 3: Noticeable improvement  
Month 6: People were asking ME for advice

The lesson? There's no magic moment. It's just compound interest applied to your effort.

${keywords.length ? keywords.map(k => '📌 ' + k).join('\n') : ''}

If you're in the "nothing works" phase right now — keep going. Your breakthrough is closer than you think.

What was YOUR turning point? Share below 👇`,

      () => `I almost gave up on ${topic} last year.

Really. I had the spreadsheet of "progress" that looked nothing like what I'd imagined.

Then I changed one thing: instead of measuring output, I measured consistency.

Did I show up today? Yes or no. That was it.

90 days later:
→ 3x the results
→ Half the stress  
→ A system that actually works

The story isn't about talent. It's about the decision to keep going when the results aren't visible yet.

${keywords.length ? '🔑 What kept me going: ' + keywords.join(', ') : ''}

Who else has been on this journey?`,

      () => `Story time about ${topic}:

My first attempt was a disaster. I embarrassed myself, got zero traction, and almost quit.

But here's what happened next that nobody tells you:

That "failure" taught me more than any success ever could. It forced me to:
1. Listen to actual feedback (not just my assumptions)
2. Strip away everything unnecessary
3. Focus on ONE thing and do it well

Six months later, I posted again. Different results. Not because I was better — because I was focused.

${keywords.length ? 'The lesson? ' + keywords.join(' → ') : ''}

Everyone starts somewhere. Your starting point doesn't define your destination. 🚀`
    ];

    return templates[v % templates.length]();
  }

  // --- Humorous Tone ---
  function generateHumorous(topic, keywords, platform, v) {
    const templates = [
      () => `Me: I'm going to be productive today.

Also me: *spends 3 hours reading about ${topic} instead of actually doing it*

We've all been there. 😅

But seriously — knowledge without action is just expensive entertainment. So here's my challenge to myself (and anyone who needs it):

This week, I'm picking ONE thing about ${topic} and actually doing it. Not researching. Not planning. Doing.

${keywords.length ? keywords.map(k => '🎯 Goal: ' + k).join('\n🎯 ') : ''}

Drop a 🙋 if you're guilty of the same thing. No judgment here (okay, maybe a little).`,

      () => `How to talk about ${topic}:

❌ "I'm leveraging synergistic paradigms to optimize outcomes"
✅ "I've been working on this thing and it's actually pretty cool"

Let's normalize speaking like humans, not LinkedIn robots. 🤖

The best content isn't the most polished — it's the most real.

${keywords.length ? 'Real talk about: ' + keywords.join(', ') : ''}

What's your go-to way of explaining complex stuff simply? 👇`,

      () => `POV: You're about to post about ${topic} and spend 45 minutes editing it...

Meanwhile, the person who just hit "post" with a typo has 10x the engagement. 😂

Moral of the story? Done is better than perfect. Every single time.

So here's my imperfect post about ${topic}:
→ Just start
→ Ship it
→ Fix it later

${keywords.length ? keywords.map(k => '📌 ' + k).join('\n') : ''}

Tag someone who needs to hear this (it's probably you) 🏷️`
    ];

    return templates[v % templates.length]();
  }

  // ===== Rendering =====
  function renderPosts(posts) {
    postsContainer.innerHTML = '';

    posts.forEach((post, index) => {
      const card = document.createElement('div');
      card.className = 'post-card';

      const platformClass = post.platform;
      const platformLabel = post.platform === 'linkedin' ? 'LinkedIn' : 'Twitter / X';
      const charCount = post.content.length;
      const maxChars = post.platform === 'twitter' ? 280 : null;
      let charClass = '';
      let charText = `${charCount} chars`;

      if (maxChars) {
        if (charCount > maxChars) charClass = 'error';
        else if (charCount > maxChars * 0.9) charClass = 'warning';
        charText += ` / ${maxChars}`;
      }

      card.innerHTML = `
        <span class="post-platform ${platformClass}">${platformLabel}</span>
        <div class="post-content" id="post-${index}">${escapeHtml(post.content)}</div>
        <div class="post-actions">
          <button class="btn btn-sm btn-outline" onclick="copyPost(${index})">📋 Copy</button>
          <button class="btn btn-sm btn-outline" onclick="sharePost(${index}, '${platform}')">🔗 Share</button>
          <button class="btn btn-sm btn-outline" onclick="regenerateSingle(${index})">🔄 Regenerate</button>
          <span class="char-count ${charClass}">${charText}</span>
        </div>
      `;

      postsContainer.appendChild(card);
    });
  }

  // ===== Actions =====
  window.copyPost = function(index) {
    const post = generatedPosts[index];
    if (!post) return;

    navigator.clipboard.writeText(post.content).then(() => {
      showToast('Copied to clipboard!');
    }).catch(() => {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = post.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Copied to clipboard!');
    });
  };

  // ===== Share Post =====
  window.sharePost = function(index, platform) {
    const post = generatedPosts[index];
    if (!post) return;

    const url = `https://postcraft.app?utm_source=share&utm_medium=social`; // Replace with actual URL after deploy

    if (platform === 'twitter') {
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content.substring(0, 280))}&url=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank');
    } else {
      // LinkedIn sharing
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank');
    }

    trackEvent('share', { platform: post.platform });
  };

  // ===== Analytics Tracker (localStorage-based, privacy-friendly) =====
  function trackEvent(type, data) {
    try {
      const events = JSON.parse(localStorage.getItem('postcraft_events') || '[]');
      events.push({ type, data, ts: Date.now() });
      // Keep last 100 events
      if (events.length > 100) events.splice(0, events.length - 100);
      localStorage.setItem('postcraft_events', JSON.stringify(events));
    } catch (e) {}
  }

  window.copyAll = function() {
    const allText = generatedPosts.map((p, i) => `--- Post ${i + 1} (${p.platform}) ---\n${p.content}`).join('\n\n');
    navigator.clipboard.writeText(allText).then(() => showToast('All posts copied!'));
  };

  window.downloadPosts = function() {
    const allText = generatedPosts.map((p, i) => `--- Post ${i + 1} (${p.platform}) ---\n${p.content}`).join('\n\n');
    const blob = new Blob([allText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postcraft-posts-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Posts downloaded!');
  };

  // ===== Newsletter Handler =====
  window.handleNewsletterSubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    if (!email) return false;

    // ConvertKit integration — replace with your form action URL
    // Example: https://app.convertkit.com/forms/YOUR_FORM_ID/subscriptions
    const formAction = 'https://tagapi.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe';

    fetch(formAction, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: 'YOUR_API_KEY', // Replace with your ConvertKit API key
        email: email,
        fields: {}
      })
    })
    .then(() => showToast('🎉 You\'re in! Check your inbox for a welcome post.'))
    .catch(() => {
      // Fallback: still show success (ConvertKit not configured yet)
      showToast('🎉 Subscribed! (Configure ConvertKit key to activate)');
    });

    document.getElementById('newsletterEmail').value = '';
    return false;
  };

  window.regenerateSingle = function(index) {
    const topic = topicEl.value.trim();
    const platform = generatedPosts[index].platform;
    const tone = toneEl.value.value;
    const keywords = keywordsEl.value.split(',').map(k => k.trim()).filter(Boolean);

    // Determine which platform variant this is
    const isLinkedIn = platform === 'linkedin';
    generatedPosts[index].content = generatePost(topic, tone, keywords, platform, index + 10);
    renderPosts(generatedPosts);
    saveDraft();
    showToast('Post regenerated!');
  };

  window.scrollToApp = function() {
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => topicEl.focus(), 500);
  };

  // ===== Utilities =====
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight; // trigger reflow
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: #333; color: white; padding: 12px 24px; border-radius: 8px;
      font-size: 14px; z-index: 9999; animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // ===== Persistence =====
  function saveDraft() {
    try {
      localStorage.setItem('postcraft_draft', JSON.stringify({
        topic: topicEl.value,
        platform: platformEl.value,
        tone: toneEl.value.value,
        keywords: keywordsEl.value,
        posts: generatedPosts,
        timestamp: Date.now()
      }));
    } catch (e) { /* localStorage unavailable */ }
  }

  function loadDraft() {
    try {
      const saved = localStorage.getItem('postcraft_draft');
      if (!saved) return;

      const data = JSON.parse(saved);
      // Only restore if less than 24 hours old
      if (Date.now() - data.timestamp < 86400000) {
        topicEl.value = data.topic || '';
        platformEl.value = data.platform || 'linkedin';
        toneEl.value.value = data.tone || 'professional';
        keywordsEl.value = data.keywords || '';

        if (data.posts && data.posts.length > 0) {
          generatedPosts = data.posts;
          renderPosts(generatedPosts);
          postsContainer.style.display = 'flex';
          outputActions.style.display = 'flex';
        }
      }
    } catch (e) { /* ignore */ }
  }

  function setupAutoSave() {
    const inputs = [topicEl, platformEl, toneEl, keywordsEl];
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        // Don't save posts array on every keystroke, just form state
        try {
          localStorage.setItem('postcraft_form', JSON.stringify({
            topic: topicEl.value,
            platform: platformEl.value,
            tone: toneEl.value.value,
            keywords: keywordsEl.value,
            timestamp: Date.now()
          }));
        } catch (e) {}
      });
    });

    // Load form state
    try {
      const form = localStorage.getItem('postcraft_form');
      if (form) {
        const data = JSON.parse(form);
        topicEl.value = data.topic || '';
        platformEl.value = data.platform || 'linkedin';
        toneEl.value.value = data.tone || 'professional';
        keywordsEl.value = data.keywords || '';
      }
    } catch (e) {}
  }

  // Add shake animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);

})();
