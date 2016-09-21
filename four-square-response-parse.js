module.exports = function (data) {
    var parsed = [];
    for (var item of  data) {
        var entry = {};
        if (item.name) {
            entry.name = item.name;
        } else {
            //we dont need a business without a name
            continue;
        }

        if (item.location.address) {
            entry.address = item.location.address;
        } else {
            entry.address = 'NA';
        }

        if (item.categories instanceof Array && item.categories.length > 0) {
            entry.categories = [];

            item.categories.forEach(function (e) {
                if (item.categories[0].icon && item.categories[0].icon.prefix && item.categories[0].icon.suffix) {
                    entry.photo = item.categories[0].icon.prefix + '64' + item.categories[0].icon.suffix;
                }else{
                    entry.photo = 'http://www.megaicons.net/static/img/icons_sizes/8/60/256/buzz-invisible-icon.png';
                }
                if (e.name) {
                    entry.categories.push(e.name);
                }
            });
        } else {
            entry.categories = 'NA';
        }

        if (item.location instanceof Object &&
            item.location.lat !== undefined &&
            item.location.lng !== undefined) {
            entry.cords = {lat: item.location.lat, lon: item.location.lng};
        } else {
            //we dont need a business without coordinates
            continue;
        }

        if (item.location.city) {
            entry.city = item.location.city;
        } else {
            entry.city = 'NA';
        }

        if (item.rating) {
            entry.rating = item.rating;
        } else {
            entry.rating = 'NA';
        }

        if (item.contact.phone) {
            entry.phone = item.contact.phone;
        } else {
            entry.phone = 'NA';
        }

        if (item.url) {
            entry.url = item.url;

        } else {
            entry.url = 'NA';
        }
        if (item.description) {
            entry.description = item.description;
        } else {
            entry.description = 'NA';
        }

        parsed.push(entry);
    }
    return parsed;
};