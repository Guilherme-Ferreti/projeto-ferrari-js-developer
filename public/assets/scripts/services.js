import firebase from './firebase-app';
import { appendTemplate, formatCurrency, getQueryString, onSnapshotError, setFormValues } from './utils';

let serviceSummary = [];

const renderServiceOptions = (context, serviceOptions) => {

    const optionsEl = context.querySelector('.options');

    optionsEl.innerHTML = '';

    serviceOptions.forEach(item => {

        const label = appendTemplate(optionsEl, 'label', `
            <input type="checkbox" name="service" value="${item.id}" />
            <div class="square">
                <div></div>
            </div>
            <div class="content">
                <span class="name">${item.name}</span>
                <span class="description">${item.description}</span>
                <span class="price">${formatCurrency(item.price)}</span>
            </div>
        `);

        label.querySelector('[type=checkbox]').addEventListener('change', e => {

            const { checked, value } = e.target;

            if (checked) {

                const service = serviceOptions.filter(option => {

                    return (Number(option.id) === Number(value));
                    // return (+option.id === +id); // O + realiza o cast da variável para Number
    
                })[0];

                serviceSummary.push(service.id);

                /* Forma polida
                const { id } = serviceOptions.filter(option => {

                    return (Number(option.id) === Number(value));
    
                })[0];

                serviceSummary.push(id);
                */

            } else {

                serviceSummary = serviceSummary.filter(id => {

                    return Number(id) !== Number(value); 
                });

            }

            renderServiceSummary(context, serviceOptions);
        });

    });

}

const renderServiceSummary = (context, serviceOptions) => {

    const tbodyEl = context.querySelector('aside tbody');

    tbodyEl.innerHTML = '';

    serviceSummary
        .map(id => serviceOptions
        .filter(item => Number(item.id) === Number(id))[0])
        .sort((a, b) => {

            if (a.name > b.name) {
                return 1;
            } else if (a.name < b.name) {
                return -1;
            } else {
                return 0;
            }

        })
        .forEach(item => {
            appendTemplate(tbodyEl, 'tr', `
                <td>${item.name}</td>
                <td class="price">${formatCurrency(item.price)}</td>
            `);
        });

    const totalEl = context.querySelector('footer .total');

    const result = serviceSummary.map(id => {

        return serviceOptions.filter(item => {
            return Number(item.id) === Number(id);
        })[0];
    });

    const total = result.reduce((totalresult, item) =>  Number(totalresult) + Number(item.price), 0);

    totalEl.innerHTML = formatCurrency(total);
}

document.querySelectorAll('#schedules-services').forEach(page => {

    const db = firebase.firestore();

    db.collection('services').onSnapshot(snapshot => {

        const services = [];

        snapshot.forEach(item => {

            services.push(item.data());
        });

        renderServiceOptions(page, services);

    }, onSnapshotError);

    const params = getQueryString();

    setFormValues(page.querySelector('form'), params);

    const button = page.querySelector('#btn-summary-toggle');

    button.addEventListener('click', () => page.querySelector('aside').classList.toggle('open'));

});