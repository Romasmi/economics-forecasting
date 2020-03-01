function StatCom(q, i, j, b) {
    var zz = 1, z = zz, k = i;
    while (k <= j) {
        zz *= (q * k) / (k - b);
        z += zz;
        k += 2;
    }
    return z;
}

function StudentT(t, n) {
    var w = Math.abs(t) / Math.sqrt(n), th = Math.atan(w);
    if (n == 1) return (1 - th / (Math.PI / 2));
    var sth = Math.sin(th), cth = Math.cos(th);
    if ((n % 2) == 1) return (1 - (th + sth * cth * StatCom(cth * cth, 2, n - 3, -1)) / (Math.PI / 2));
    else return (1 - sth * StatCom(cth * cth, 1, n - 3, -1));
}

function AStudentT(n, alpha)  // Возвращает t-критерий Стьюдента по числу
{                            // степеней свободы n и уровню значимости alpha
    var v = 0.5, dv = 0.5, t = 0;
    while (dv > 1e-6) {
        t = 1 / v - 1;
        dv /= 2;
        if (StudentT(t, n) > alpha) v -= dv;
        else v += dv;
    }
    return t.toFixed(presicion);
}
