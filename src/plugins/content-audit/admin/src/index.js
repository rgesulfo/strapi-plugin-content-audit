import React from 'react';
import {
  prefixPluginTranslations,
  useCMEditViewDataManager,
} from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import {
  Card,
  CardBody,
  TableLabel,
  H2,
  Divider,
  Text,
  Flex,
  Box,
  Tooltip,
} from '@strapi/design-system';

const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const icon = pluginPkg.strapi.icon;
const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/App');

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.registerPlugin({
      description: pluginDescription,
      icon,
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      isRequired: pluginPkg.strapi.required || false,
      name,
    });
  },

  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'content-audit-info',
      Component: () => {
        const {
          initialData,
          allLayoutData: { contentType: { attributes } },
        } = useCMEditViewDataManager();
                
        let fields = [];   

        for (let att in attributes) {
          for (let data in initialData) {
            if (att === data) {
              fields = [...fields, {
                name: att,
                type: attributes[att].type,
                value: initialData[data],
                required: attributes[att].required || false,
              }];
            }
          }
        }

        const totalFields = fields.length - 1;
        const requiredFields = fields.filter(field => field.required).length;
        const filledFields = fields.filter(field => field.value).length;

        return (
          <Card>
            <CardBody>
              <Box width="100%">
                <Box paddingBottom={3} paddingTop={4}>
                  <TableLabel textColor="neutral600">Completion plugin</TableLabel>
                </Box>
                <Divider />
                  <Flex justifyContent="space-between" paddingTop={2} paddingBottom={2}>
                    <H2>{Math.round((filledFields / totalFields) * 100) || 0}%</H2>
                    <Text textColor="neutral600">{totalFields} fields</Text>
                  </Flex>
                  <Box id="completion-bar" height="8px" width="100%" hasRadius background="neutral200">
                    <Tooltip description={`${requiredFields} required fields`}>
                      <Box id="required-bar" height="8px" width={`${(requiredFields / totalFields) * 100}%`} hasRadius background="success200" />
                    </Tooltip>
                    <Tooltip description={`${filledFields} filled fields`}>
                      <Box id="filled-bar" height="8px" width={`${(filledFields / totalFields) * 100 || 0}%`} hasRadius background="success600" style={{ position: 'relative', top: '-8px'}} />
                    </Tooltip>
                  </Box>
                  <Flex alignItems="center" paddingTop={2} paddingBottom={2}>
                    <Box id ="filled-dot" height="8px" width="8px" hasRadius background="success600" marginRight={1} />
                    <Text textColor="neutral600" small>Filled</Text>
                    <Box id ="required-dot" height="8px" width="8px" hasRadius background="success200" marginLeft={2} marginRight={1} />
                    <Text textColor="neutral600" small>Required</Text>
                  </Flex>                  
              </Box>
            </CardBody>
          </Card>
        );
      },
    });
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
