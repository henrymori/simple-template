const TemplateEngine = require('templateEngine');

test('TemplateEngine can perform simple template substitutions ', () => {
    const template = "Hi <% person.firstName %>";
    const options = { 
        person: {
            firstName: "Henry"
        }
     }
    const templateEngine = new TemplateEngine({
        template,
        options
    })
    const rendered = templateEngine.render({});
    const expected = "Hi Henry";
    expect(rendered).toEqual(expected);
});

test('TemplateEngine can perform simple logic ', () => {
    const template = "My skills: " +
    "<%if(showSkills) {%>" +
        "<%for(let index in skills) {%>" +
        "<a href=\"#\"><%skills[index]%></a>" +
        "<%}%>" +
    "<%} else {%>" +
        "<p>none</p>" +
    "<%}%>";
    const options = { 
        showSkills: true,
        skills: ["SQL", "JavaScript", "Python"]
     }
    const templateEngine = new TemplateEngine({
        template,
        options
    })
    const rendered = templateEngine.render({});
    const expected = "My skills: <a href=\"#\">SQL</a><a href=\"#\">JavaScript</a><a href=\"#\">Python</a>";
    expect(rendered).toEqual(expected);
});

test('TemplateEngine can perform simple filter actions ', () => {
    const template = "My favorite fruit is <% bananas | upperCase %>";
    const filters = {
        upperCase: (input) => {
            return input.toUpperCase();
        }
    }
    const templateEngine = new TemplateEngine({
        template,
        filters
    })
    const rendered = templateEngine.render({});
    const expected = "My favorite fruit is BANANAS";
    expect(rendered).toEqual(expected);
});

test('TemplateEngine can receive filters on call to render ', () => {
    const template = "My favorite fruit is <% bananas | upperCase %>";
    const filters = {
        upperCase: (input) => {
            return input.toUpperCase();
        }
    }
    const templateEngine = new TemplateEngine({
        template
    })
    let rendered = templateEngine.render({ });
    rendered = templateEngine.render({ filters });
    const expected = "My favorite fruit is BANANAS";
    expect(rendered).toEqual(expected);
});