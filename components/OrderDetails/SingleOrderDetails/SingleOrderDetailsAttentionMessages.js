import React from 'react';
import PropTypes from 'prop-types';

import { attentionMessageType } from '~/types';

import Alert from '~/components/common/Alert';
import { utcToEst, dateTimeFormats } from '~/components/common/EstDate';

const SingleOrderDetailsAttentionMessages = ({ attentionMessages, alertType }) => (
  <>
    {attentionMessages && attentionMessages.map((attentionMessage, index) => (
      <Alert className="mb-4 text-sm" type={alertType} key={index}>
        <p className="pb-2 font-bold">
					{utcToEst(attentionMessage.created_at, dateTimeFormats.human)}
					{` EST`}
        </p>
        <p>
          {attentionMessage.order_message}
        </p>
      </Alert>
    ))}
  </>
);

SingleOrderDetailsAttentionMessages.defaultProps = {
  alertType: 'info',
  attentionMessages: null,
};

SingleOrderDetailsAttentionMessages.propTypes = {
  attentionMessages: PropTypes.arrayOf(attentionMessageType),
  alertType: PropTypes.string,
};

export default SingleOrderDetailsAttentionMessages;
