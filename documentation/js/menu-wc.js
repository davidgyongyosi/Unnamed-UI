'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">unnamed-ui documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                        <li class="link">
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/IconModule.html" data-type="entity-link" class="deprecated-name">IconModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-IconModule-14e87a386b44531744b1680b090d0a8fcd496805a3fbc589f3a73b51f551dea7b01f5db9bcce50e85e0c0f8314d584b192605a80e0eb3158735d5f7f6f168d23"' : 'data-bs-target="#xs-directives-links-module-IconModule-14e87a386b44531744b1680b090d0a8fcd496805a3fbc589f3a73b51f551dea7b01f5db9bcce50e85e0c0f8314d584b192605a80e0eb3158735d5f7f6f168d23"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-IconModule-14e87a386b44531744b1680b090d0a8fcd496805a3fbc589f3a73b51f551dea7b01f5db9bcce50e85e0c0f8314d584b192605a80e0eb3158735d5f7f6f168d23"' :
                                        'id="xs-directives-links-module-IconModule-14e87a386b44531744b1680b090d0a8fcd496805a3fbc589f3a73b51f551dea7b01f5db9bcce50e85e0c0f8314d584b192605a80e0eb3158735d5f7f6f168d23"' }>
                                        <li class="link">
                                            <a href="directives/NxIconDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NxIconDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NxIconModule.html" data-type="entity-link" class="deprecated-name">NxIconModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-NxIconModule-2febc3041e0e012c92df4095fc09daa7e9ddf40d6ed52d4d218f09c7913cfd137d75b9659eb3231be39012b988c6514349b1be7f115d40e0d91a7ef36bec3d39"' : 'data-bs-target="#xs-directives-links-module-NxIconModule-2febc3041e0e012c92df4095fc09daa7e9ddf40d6ed52d4d218f09c7913cfd137d75b9659eb3231be39012b988c6514349b1be7f115d40e0d91a7ef36bec3d39"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-NxIconModule-2febc3041e0e012c92df4095fc09daa7e9ddf40d6ed52d4d218f09c7913cfd137d75b9659eb3231be39012b988c6514349b1be7f115d40e0d91a7ef36bec3d39"' :
                                        'id="xs-directives-links-module-NxIconModule-2febc3041e0e012c92df4095fc09daa7e9ddf40d6ed52d4d218f09c7913cfd137d75b9659eb3231be39012b988c6514349b1be7f115d40e0d91a7ef36bec3d39"' }>
                                        <li class="link">
                                            <a href="directives/NxIconDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NxIconDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ButtonComponent.html" data-type="entity-link" >ButtonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ButtonComponent-1.html" data-type="entity-link" >ButtonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderComponent.html" data-type="entity-link" >HeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NxIconComponent.html" data-type="entity-link" >NxIconComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NxIconComponent-1.html" data-type="entity-link" >NxIconComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PageComponent.html" data-type="entity-link" >PageComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/InputDirective.html" data-type="entity-link" >InputDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/NxIconDirective.html" data-type="entity-link" >NxIconDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/NxIconDirective-1.html" data-type="entity-link" >NxIconDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ControlValueAccessorBase.html" data-type="entity-link" >ControlValueAccessorBase</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/A11yUtility.html" data-type="entity-link" >A11yUtility</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FocusMonitor.html" data-type="entity-link" >FocusMonitor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IconService.html" data-type="entity-link" >IconService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IconService-1.html" data-type="entity-link" >IconService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OverlayService.html" data-type="entity-link" >OverlayService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResponsiveUtility.html" data-type="entity-link" >ResponsiveUtility</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/BreakpointConfig.html" data-type="entity-link" >BreakpointConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CachedIconDefinition.html" data-type="entity-link" >CachedIconDefinition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FocusMonitorData.html" data-type="entity-link" >FocusMonitorData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IconDefinition.html" data-type="entity-link" >IconDefinition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Manifest.html" data-type="entity-link" >Manifest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OverlayConfig.html" data-type="entity-link" >OverlayConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OverlayData.html" data-type="entity-link" >OverlayData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OverlayPosition.html" data-type="entity-link" >OverlayPosition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RenderMeta.html" data-type="entity-link" >RenderMeta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RenderMeta-1.html" data-type="entity-link" >RenderMeta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TestConfig.html" data-type="entity-link" >TestConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});