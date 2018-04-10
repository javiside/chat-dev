import * as React from 'react';
import { Component } from 'react';
import linkedin from '../images/linkedin.svg';
import { IntlStore } from '../store';
import { MergedStore } from '../store/reducers/rootReducer';
import { connect } from 'react-redux';
import * as flags from '../images/flags/index';
import { selectedLocale } from '../store/actions/intlActions';

class Footer extends Component<connectedProps> {
  constructor(props: connectedProps) {
    super(props);
    this.handleChangeLoc = this.handleChangeLoc.bind(this);
  }
  handleChangeLoc(e: React.MouseEvent<HTMLImageElement>) {
    this.props.onChangeLocale((e.target as HTMLImageElement).id);
  }
  render() {
    return (
      <footer className="footer">
        <span className="footer-cont">
          {this.props.IntlR.messages.copy} © 2018 Javier Martinez.
          <a href="https://www.linkedin.com/in/javiside/" className="c-white">
          <img 
            src={linkedin} 
            className="linkedin-logo" 
            alt="https://www.linkedin.com/in/javiside/" 
          />
          </a>
        </span>
        <span className="flags-span">
              <img src={flags.cn} alt="cn" id="cn" onClick={this.handleChangeLoc} className="flag-icon"/>
              <img src={flags.en} alt="en" id="en" onClick={this.handleChangeLoc} className="flag-icon"/>
              <img src={flags.es} alt="es" id="es" onClick={this.handleChangeLoc} className="flag-icon"/>
              <img src={flags.fr} alt="fr" id="fr" onClick={this.handleChangeLoc} className="flag-icon"/>
              <img src={flags.ge} alt="ge" id="ge" onClick={this.handleChangeLoc} className="flag-icon"/>
              <img src={flags.in} alt="in" id="in" onClick={this.handleChangeLoc} className="flag-icon"/>
              <img src={flags.it} alt="it" id="it" onClick={this.handleChangeLoc} className="flag-icon"/>
              <img src={flags.jp} alt="jp" id="jp" onClick={this.handleChangeLoc} className="flag-icon"/>
              <img src={flags.kl} alt="kl" id="kl" onClick={this.handleChangeLoc} className="flag-icon"/>
              <img src={flags.kr} alt="kr" id="kr" onClick={this.handleChangeLoc} className="flag-icon"/>
              <img src={flags.pt} alt="pt" id="pt" onClick={this.handleChangeLoc} className="flag-icon"/>
              <img src={flags.ru} alt="ru" id="ru" onClick={this.handleChangeLoc} className="flag-icon"/>
        </span>
      </footer>
    );
  }
}

type m2p = { IntlR: IntlStore};
type d2p = { onChangeLocale(locale: string): void; };
type connectedProps = m2p&d2p;
export default connect<m2p, d2p, {}, MergedStore>( 
  (store: MergedStore) => ({ IntlR: store.IntlReducer }),
  {onChangeLocale: (locale) => selectedLocale(locale)}
)(Footer);