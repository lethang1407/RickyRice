package org.group5.swp391.config;

import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.*;


@Configuration
public class RabbitMqConfig {
    public static final String QUEUE_NAME = "debtQueue";
    public static final String EXCHANGE_NAME = "debtExchange";

    //mtran vua code
    public static final String QUEUE_NAME2 = "invoice-create-queue";
    public static final String EXCHANGE_NAME2 = "invoice-exchange";
    public static final String ROUTING_KEY2 = "invoiceCreate";

    @Bean
    public Queue queue() {
        return new Queue(QUEUE_NAME, true);
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding binding(Queue queue, DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with("debtKey");
    }

    //mtran
    @Bean
    public Queue queue2() {
        return new Queue(QUEUE_NAME2, true);
    }
    @Bean
    public DirectExchange exchange2() {
        return new DirectExchange(EXCHANGE_NAME2);
    }
    @Bean
    public Binding binding2 (Queue queue2, DirectExchange exchange2) {
        return BindingBuilder.bind(queue2).to(exchange2).with(ROUTING_KEY2);
    }
    //

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }
}
