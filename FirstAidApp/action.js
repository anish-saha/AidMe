
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * Template: https://github.com/alexa/skill-sample-nodejs-howto
 * 
 * @author: Anish Saha
 * 
 **/

'use strict';

const Alexa = require('alexa-sdk');
const recipes = require('./recipes');

var illnessList = ['neck injuries', 'a neck injury','spine injuries', 'a spine injury', 'choking', 'AED',
'controlling bleeding', 'a deep wound', 'burns', 'a burn victim', 'poisoning', 'stroke', 'a stroke victim',
'injured', 'hurt', 'unconscious', 'bleeding', 'throwing up', 'vomiting', 'hurt their neck', 'having a stroke',
'bleeding out', 'needs medical attention', 'injuries', 'checking an injured adult', 'severe injuries'];
var cprlist = ['cpr', 'how to administer cpr', 'administering cpr'];
var chokelist = ['choking'];
var done = 0;
var ready = 1;
var restart = 1;
var cpr = 0;
var con = 0;
var ask = 0;
var rhy = 0;

const APP_ID = undefined;

const handlers = {
    'NewSession': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'RecipeIntent': function () {
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }
        
        if (illnessList.indexOf(itemName) !== -1) {
            if (chokelist.indexOf(itemName) !== -1) {
                con = 1;
                this.emit(':ask', 'Is the person conscious or unconscious?');
            } else {
                ask = 1;
                this.emit(':ask', 'Call 911 and seek immediate medical attention. Do you need help with anything else?');
            }
        } else if (cprlist.indexOf(itemName) !== -1) {
            cpr = 1;
            this.emit(':ask', 'Lay the person on a firm, flat surface. You will give 30 chest compressions. Say quit CPR or say stop CPR to end the process. Say ready when you are ready.');
        } else {
            this.emit(":ask", 'Sorry, I do not know the procedure for that. What else can I help with?');   
        }
    },
    'DoneIntent': function() {
        if (cpr === 1) {
            if (done === 1) {
                done = 0;
            } else {
                done = 1;
            }
            if (done === 1) {
                this.emit(':ask', 'Now we will do 2 rescue breaths. Tilt the head back and lift the chin up. Pinch the nose shut then make a complete seal over the person’s mouth. Blow in for about 1 second to make the chest clearly rise. Give rescue breaths, one after the other. Say done to continue. Say quit CPR or stop CPR to quit.');
            } else {
                rhy = 1;
                this.emit(':ask', 'Push hard, push fast in the middle of the chest at least 2 inches deep and at least 100 compressions per minute. Say rhythm for help with counting. Say done to continue. Say quit CPR or say stop CPR to quit.');
            }
        } else {
            this.emit(":ask", 'Sorry, I do not know the procedure for that. What else can I help with?');   
        }
    },
    'ReadyIntent': function() {
        if (cpr === 1) {
            rhy = 1;
            this.emit(':ask', 'Push hard, push fast in the middle of the chest at least 2 inches deep and at least 100 compressions per minute. Say rhythm for help with counting. Say done to continue. Say quit CPR or say stop CPR to quit. Say what can I say for all options.');
        } else {
            this.emit(":ask", 'Sorry, I do not know the procedure for that. What else can I help with?');   
        }
    },
    'QuitIntent': function() {
        if (cpr === 1) {
            this.emit(':ask', 'Are you sure you want to stop?');
        } else {
            this.emit(":ask", 'Sorry, I do not know the procedure for that. What else can I help with?');   
        }
    },
    'ConsciousIntent': function() {
        if (con === 1) {   
            ask = 1;
            this.emit(':ask', 'Call 911 and seek immediate medical attention. Do you need help with anything else?');
            con = 0;
        } else {
            this.emit(':ask', 'Sorry, I do not know the procedure for that. What else can I help with?');   
        }
    },
    'ConfirmIntent': function() {
        if (cpr === 1) {
            this.emit(':ask', 'First Aid here, would you like help with anything else?');
            cpr = 0;
        } else {
            this.emit(':ask', 'What can I help you with?');
        }
    },
    'DenyIntent': function() {
        if (cpr === 1) {
            this.emit(':ask', 'Let\'s keep going. You can restart, quit, or ask for help at any time. Say ready or restart to keep going.');
        } else {
            this.emit(':tell', 'Thanks for using First Aid!');
        }
    },
    'WhatIntent': function() {
        if (cpr === 0) {
            this.emit(':ask', 'You can say things like: I need help with CPR, neck injuries, spine injuries, burns, a stroke victim, AED, poisoning, controlling bleeding, choking, and checking an injured adult. What else can I help you with?');  
        } else {
            this.emit(':ask', 'You can say the commands: How do I do chest compressions, How do I do rescue breaths, rhythm, restart, quit CPR or stop CPR. What else can I help you with?');
        }
    },
    'HowChestIntent': function() {
        if (cpr === 1) {
            this.emit(':ask', 'Push hard, push fast in the middle of the chest at least 2 inches deep and at least 100 compressions per minute. Say done or restart to continue. Say quit CPR or stop CPR to quit.');
        } else {
            this.emit(':ask', 'Sorry, I do not know the procedure for that. What else can I help with?');   
        }
    },
    'HowRescIntent': function() {
        if (cpr === 1) {
            this.emit(':ask', 'Tilt the head back and lift the chin up. Pinch the nose shut then make a complete seal over the person’s mouth. Blow in for about 1 second to make the chest clearly rise. Give rescue breaths, one after the other. Say done or restart to continue. Say quit CPR or stop CPR to quit.');
        } else {
            this.emit(':ask', 'Sorry, I do not know the procedure for that. What else can I help with?');   
        }
    },
    'RhythmIntent': function() {
        if (rhy === 1 && cpr === 1) {
            this.emit(':ask', 'one, two, three, four, five, six, seven, eight, nine, ten, 11, 12, 13, 14, 15, 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30. Say done to continue, or you can restart by saying restart. Say quit CPR or say stop CPR to quit.');
        } else {
            this.emit(':ask', 'Sorry, I do not know the procedure for that. What else can I help with?');   
        }
    }
};

const languageStrings = {
    'en-US': {
        translation: {
            RECIPES: recipes.RECIPE_EN_US,
            SKILL_NAME: 'FIRST AID MADE EASY',
            WELCOME_MESSAGE: "This is First Aid, What can I help you with?",
            WELCOME_REPROMT: 'For more detailed instructions on usable commands, please say help me.',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
