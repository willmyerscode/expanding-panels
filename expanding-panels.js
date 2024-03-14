/**
* Expanding Panels
* Copyright Will-Myers.com
*/

class ExpandingPanels {

constructor (el) {
 this.el = el;

 // Get Data Attributes
 this.collection = this.el.getAttribute('data-source');
 this.collection = this.collection.toLowerCase();
 this.collection = this.collection.trim();

 this.panelCount = this.el.getAttribute('panel-count') || '4';
 this.panelCount = this.panelCount.toLowerCase();
 this.panelCount = this.panelCount.trim();

 // Whole Panel Link
 this.panelLink = this.el.getAttribute('data-link') || 'false';
 this.panelLink = this.panelLink.toLowerCase();
 this.panelLink = this.panelLink.trim();

 // Open On Load
 this.onLoad = this.el.getAttribute('data-open') || 'false';
 this.onLoad = this.onLoad.toLowerCase();
 this.onLoad = this.onLoad.trim();

 // Find Action
 this.action = this.el.getAttribute('data-action') || 'hover';
 this.action = this.action.toLowerCase();
 this.action = this.action.trim();

// Button Text
this.buttonText = this.el.getAttribute('data-text') || 'View More';
this.buttonText = this.buttonText.toLowerCase();
this.buttonText = this.buttonText.trim();
 
 this.collectionJSON = this.collection + '?format=json&date=' + new Date().getTime();
 this.collectionData;

 // Find Parent Section
 this.parentSection = this.el.closest('.content');

// Upper Panel Limit
 this.upperLimit = 6;


 
this.init();

}

async init () {

this.collectionData = await this.getCollectionData();

this.buildExpandingPanels();

this.addHoverEventListener();

this.addPanelLink();

this.openOnLoad();

}

async getCollectionData() {
   try {
    const response = await fetch(this.collectionJSON);
     console.log(response);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    this.data = await response.json();
    this.data.items.forEach(item => {
      this.title = item.title;
      this.fullUrl = item.fullUrl;
      this.image = item.assetUrl;
      this.excerpt = item.excerpt;
      this.sourceUrl = item.sourceUrl;
      item.url = this.sourceUrl || this.fullUrl || '';

    });
    return this.data; // Return the data so it can be used after await
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}  

buildExpandingPanels() {  
let expandingPanel = document.createElement('div');
expandingPanel.classList.add('wm-grid');
this.el.append(expandingPanel);
let panel;

const limit = Math.min(this.panelCount, this.upperLimit);

for (let i = 0; i < limit; i++) {

const focalPoint = this.data.items[i].mediaFocalPoint ? `${this.data.items[i].mediaFocalPoint.x * 100}% ${this.data.items[i].mediaFocalPoint.y * 100}%` : '50% 50%';
    
panel = `
   <div class="wm-panel" style="background-image: url(${this.data.items[i].assetUrl}); background-position:${focalPoint}">
    <div class="vertical-title"><h4>${this.data.items[i].title}</h4></div>
    <div class="wm-content-wrapper">
       <div class="panel-background"></div>
      <div class="title"><h4>${this.data.items[i].title}</h4></div>
      <div class="excerpt"><p>${this.data.items[i].excerpt}</p></div>
      <a class="wm-button sqs-block-button-element--medium sqs-button-element--primary sqs-block-button-element" href="${this.data.items[i].url}">${this.buttonText}</a>
    </div>
  </div>`;


expandingPanel.insertAdjacentHTML("beforeEnd", panel);
}

   // Find Panels
 this.panels = document.querySelectorAll('.wm-panel');
 this.instancePanels = this.el.querySelectorAll('.wm-panel');


}

addHoverEventListener() {
this.instancePanels.forEach((panel, index) => {
  // Add hover event listener to each panel
  panel.addEventListener('mouseover', () => {
    // Add the 'panel-active' class when hovering
    panel.classList.add('panel-active');
    panel.classList.remove('panel-inactive');

    // Remove 'panel-active' class from other panels of this instance
    this.instancePanels.forEach((otherPanel, otherIndex) => {
      if (otherIndex !== index) {
        otherPanel.classList.remove('panel-active');
        otherPanel.classList.add('panel-inactive');
      }
    });
  });

  // Remove the 'panel-active' class when not hovering
  panel.addEventListener('mouseout', () => {
    panel.classList.remove('panel-active');
    panel.classList.add('panel-inactive');
    // Remove 'panel-inactive' class from other panels of this instance
    this.instancePanels.forEach((otherPanel) => {
      otherPanel.classList.remove('panel-inactive');
    });
  });
});
}

addPanelLink(){
if (this.panelLink.includes("true")) {
  this.panels.forEach((panel, index) => {
    let wholePanelLink = `<a class="wm-panel-link" href="${this.data.items[index].url}"></a>`;
    panel.insertAdjacentHTML("afterBegin", wholePanelLink);
  });
}
} 

openOnLoad(){
if (this.panels.length > 0) {
  this.firstPanel = this.panels[0];
  this.lastPanel = this.panels[this.panels.length - 1];

  if (this.onLoad.includes("first")) {
    this.firstPanel.classList.add('panel-active');
    this.instancePanels.forEach((panel, index) => {
      if (index !== 0) {
        panel.classList.add('panel-inactive');
      } else {
        panel.classList.remove('panel-inactive');
      }
    });
  } else if (this.onLoad.includes("last")) {
    this.lastPanel.classList.add('panel-active');
    this.instancePanels.forEach((panel, index) => {
      if (index !== this.instancePanels.length - 1) {
        panel.classList.add('panel-inactive');
      }

    });
  } else if (!isNaN(parseInt(this.onLoad))) {
     this.instancePanels.forEach((panel, index) => {
      if (index == parseInt(this.onLoad) - 1) {
        panel.classList.add('panel-active');
        panel.classList.remove('panel-inactive');
      } else {
        panel.classList.add('panel-inactive');
        panel.classList.remove('panel-active');
      }
    });
  }
 
}

}

}
(function(){
  // Find All Instances
  let allInstances = document.querySelectorAll('[data-wm-plugin="expanding-panels"]');
  
  // Loop Through All Instances
  for (let instance of allInstances) {
    new ExpandingPanels(instance);
  }
}())
