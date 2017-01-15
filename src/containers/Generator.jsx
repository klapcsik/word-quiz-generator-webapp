import { Record, List } from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as GeneratorActions from 'redux/actions/generator';
import * as SettingsActions from 'redux/actions/settings';
import * as ErrorActions from 'redux/actions/error';
import RaisedButton from 'material-ui/RaisedButton';
import Header from 'components/Header';
import Content from 'components/Content';
import Toolbar from 'components/Toolbar';
import ErrorPopup from 'components/ErrorPopup';
import TargetSettings from 'components/settings/Target';
import SourcesSettings from 'components/settings/Sources';
import FormatSettings from 'components/settings/Format';
import AdvancedSettings from 'components/settings/Advanced';
import { translate } from 'react-i18next';

const mapStateToProps = (state) => ({
  settings: state.settings,
  resources: state.resources,
  errors: state.errors,
});

const mapDispatchToProps = (dispatch) => ({
  generatorActions: bindActionCreators(GeneratorActions, dispatch),
  settingsActions: bindActionCreators(SettingsActions, dispatch),
  errorActions: bindActionCreators(ErrorActions, dispatch),
});

class Generator extends Component {
  static propTypes = {
    settings: PropTypes.instanceOf(Record).isRequired,
    resources: PropTypes.instanceOf(Record).isRequired,
    errors: PropTypes.instanceOf(List).isRequired,
    generatorActions: PropTypes.shape({
      fetchAllMaterials: PropTypes.func.isRequired,
      fetchAllSources: PropTypes.func.isRequired,
      fetchAllPresets: PropTypes.func.isRequired,
      clearQuiz: PropTypes.func.isRequired,
      generate: PropTypes.func.isRequired,
    }).isRequired,
    settingsActions: PropTypes.shape({
      updateMaterial: PropTypes.func.isRequired,
      updateSections: PropTypes.func.isRequired,
      updateSources: PropTypes.func.isRequired,
      clearSources: PropTypes.func.isRequired,
      updateFormat: PropTypes.func.isRequired,
      updateAdvanced: PropTypes.func.isRequired,
    }).isRequired,
    errorActions: PropTypes.shape({
      dismissError: PropTypes.func.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.generatorActions.fetchAllMaterials();
    this.props.generatorActions.fetchAllSources();
    this.props.generatorActions.fetchAllPresets();
  }

  onGenerate = () => {
    this.props.generatorActions.clearQuiz();
    browserHistory.push('/preview');
    this.props.generatorActions.generate(this.props.settings);
  }

  render() {
    const {
      settings,
      resources,
      errors,
      t,
    } = this.props;
    const {
      updateMaterial,
      updateSections,
      updateSources,
      clearSources,
      updateFormat,
      updateAdvanced,
    } = this.props.settingsActions;
    const { dismissError } = this.props.errorActions;
    const lang = settings.target.material.get('lang') || '';
    const preset = resources.presets.get(lang);

    return (
      <div>
        <ErrorPopup
          errors={errors}
          dismissError={dismissError}
        />
        <Header title="Settings" />
        <Content>
          <Toolbar>
            <RaisedButton
              primary
              label={t('labels.generate')}
              onTouchTap={this.onGenerate}
            />
          </Toolbar>
          <p>{t('descriptions.required')}</p>
          <TargetSettings
            materials={resources.materials}
            currentSettings={settings.target}
            updateMaterial={updateMaterial}
            updateSections={updateSections}
          />
          <FormatSettings
            currentSettings={settings.format}
            updateFormat={updateFormat}
          />
          <SourcesSettings
            sources={resources.sources}
            filter={lang}
            currentSettings={settings.sources}
            updateSources={updateSources}
            clearSources={clearSources}
          />
          <AdvancedSettings
            preset={preset}
            currentSettings={settings.advanced}
            updateAdvanced={updateAdvanced}
          />
        </Content>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  translate()(
    Generator,
  ),
);
